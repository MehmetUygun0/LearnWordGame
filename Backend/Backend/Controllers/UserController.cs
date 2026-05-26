using Backend.Data;
using Backend.Models;
using Backend.Models.DTOs;
using Backend.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Security.Claims;


namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : BaseController
    {
        private readonly AppDbContext _context;
        private readonly ResetCodeStore _resetCodeStore;
        private readonly EmailService _emailService;

        public UserController(AppDbContext appContext, ResetCodeStore resetCodeStore, EmailService emailService)
        {
            _context = appContext;
            _resetCodeStore = resetCodeStore;
            _emailService = emailService;
        }
        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] RegisterDto dto)
        {
            byte[] hashedPassword = SHA256.HashPassword(dto.Password);
            User? userFromDb = await _context.Users
            .Where(u => u.Email == dto.Email)
            .FirstOrDefaultAsync();
            var listecik = await _context.Users.ToListAsync();

            if (userFromDb != null)
            {
                return NotFound(new { message = "Kullanıcı zaten var." });
            }

            await _context.Users.AddAsync(new User { UserName = dto.UserName, Password = hashedPassword, Email = dto.Email, CreatedAt = DateTime.UtcNow });
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == dto.UserName);

            if (user is null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı." });
            }
            byte[]? userPassword = user.Password;
            if (SHA256.VerifyPassword(dto.Password, userPassword))
            {
                var accessToken = JwtHelper.GenerateToken(dto.UserName, user.Id.ToString());
                var refreshToken = JwtHelper.GenerateRefreshToken();

                user.RefreshToken = refreshToken;
                user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(30);

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    accessToken,
                    refreshToken
                });
            }
            else
            {
                return Unauthorized("Şifre hatalı.");
            }
        }

        [HttpPost("forgot-password")]
        public async Task<ActionResult> ForgotPassword(string usernameOrEmail)
        {
            User? user;
            try
            {
                var control = new System.Net.Mail.MailAddress(usernameOrEmail);
                user = await _context.Users.FirstOrDefaultAsync(u => u.Email == usernameOrEmail);
            }
            catch
            {
                user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == usernameOrEmail);
            }
            if (user is null)
                return NotFound(new { message = "Kullanıcı bulunamadı." });

            int resetCode = new Random().Next(100000, 999999);
            PasswordResetCode prc = new PasswordResetCode(user.Email, resetCode);
            await _emailService.SendResetCodeAsync(user.Email, resetCode, prc);
            _resetCodeStore.AddCode(user.Email, resetCode);
            return Ok("Sıfırlama kodu mail adresine gönderildi.");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            User? user;
            try
            {
                _ = new MailAddress(dto.UserNameOrEmail);
                user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.UserNameOrEmail);
            }
            catch
            {
                user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == dto.UserNameOrEmail);
            }

            if (user == null)
            {
                return NotFound("Kullanıcı veri tabanında bulunamadı.");
            }

            bool controlCode = _resetCodeStore.VerifyCode(user.Email, dto.Code);
            if (!controlCode)
            {
                return BadRequest("Girdiğin kod hatalı veya süresi dolmuş.");
            }

            user.Password = SHA256.HashPassword(dto.NewPassword);
            await _context.SaveChangesAsync();
            _resetCodeStore.RemoveCode(user.Email);
            return Ok("Şifren başarıyla sıfırlandı. Yeni şifrenle giriş yapabilirsin!");
        }
        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.RefreshToken))
                return BadRequest("Refresh token boş olamaz.");

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.RefreshToken == dto.RefreshToken);

            if (user == null || user.RefreshTokenExpiryTime < DateTime.UtcNow)
                return Unauthorized("Refresh token geçersiz veya süresi dolmuş.");

            var newAccessToken = JwtHelper.GenerateToken(user.UserName, user.Id.ToString());
            var newRefreshToken = JwtHelper.GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(30);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                accessToken = newAccessToken,
                refreshToken = newRefreshToken
            });
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()//kullanıcının profil bilgilerini getiren endpoint
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı." });
            }

            var progressSettings = await _context.UserProgressSettings
                .FirstOrDefaultAsync(setting => setting.UserId == userId);

            if (progressSettings == null)
            {
                progressSettings = new UserProgressSettings
                {
                    UserId = (int)userId
                };
                await _context.UserProgressSettings.AddAsync(progressSettings);
                await _context.SaveChangesAsync();
            }

            var learnedWordProgresses = await _context.UserWordProgresses
                .Include(progress => progress.Word)
                .Where(progress => progress.UserId == userId && progress.IsLearned)
                .ToListAsync();

            var levelStats = learnedWordProgresses
                .Where(progress => progress.Word != null && !string.IsNullOrWhiteSpace(progress.Word.Level))
                .GroupBy(progress => progress.Word!.Level)
                .OrderBy(group => group.Key)
                .Select(group => new ProfileLevelStatDto
                {
                    Level = group.Key,
                    Words = group.Count()
                })
                .ToList();

            var profile = new ProfileDto
            {
                UserName = user.UserName,
                CreatedAt = DateTime.UtcNow,
                Level = progressSettings.UserLevel,
                TotalLearnedWords = Math.Max(progressSettings.TotalWordsLearned, learnedWordProgresses.Count),
                DailyNewWords = progressSettings.NumberOfNewWords,
                LevelBasedLearnedWords = levelStats
            };

            return Ok(profile);
        }
        [Authorize]
        [HttpPut("profile/daily-words")]
        public async Task<IActionResult> UpdateDailyWords([FromBody] UpdateDailyWordsDto dto)//günlük kaç yeni kelime öğrenmek istediğini güncelleme endpointi
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized();

            if (dto.DailyNewWords < 5 || dto.DailyNewWords > 25)
            {
                return BadRequest(new { message = "Günlük yeni kelime sayısı 5 ile 25 arasında olmalıdır." });
            }


            var progressSettings = await _context.UserProgressSettings
                .FirstOrDefaultAsync(setting => setting.UserId == userId);

            if (progressSettings == null)
            {
                progressSettings = new UserProgressSettings
                {
                    UserId = (int)userId
                };
                await _context.UserProgressSettings.AddAsync(progressSettings);
            }

            progressSettings.NumberOfNewWords = dto.DailyNewWords;
            await _context.SaveChangesAsync();
            return Ok(new { dailyNewWords = progressSettings.NumberOfNewWords });
        }
        [Authorize]
        [HttpPut("profile/users-level-update")]
        public async Task<IActionResult> UpdateLevel([FromBody] UpdatelevelDto dto)//kullanıcının seviyesini güncelleme endpointi
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized();

            var progressSettings = await _context.UserProgressSettings
                .FirstOrDefaultAsync(setting => setting.UserId == userId);

            if (progressSettings == null)
            {
                progressSettings = new UserProgressSettings
                {
                    UserId = (int)userId
                };
                await _context.UserProgressSettings.AddAsync(progressSettings);
            }

            progressSettings.UserLevel = dto.Level;
            await _context.SaveChangesAsync();
            return Ok(new { dailyNewWords = progressSettings.NumberOfNewWords });
        }
    }
}
