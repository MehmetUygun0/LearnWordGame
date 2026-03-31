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
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ResetCodeStore _resetCodeStore;

        public UserController(AppDbContext appContext, ResetCodeStore resetCodeStore)
        {
            _context = appContext;
            _resetCodeStore = resetCodeStore;
        }
        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] RegisterDto dto)
        {
            byte[] hashedPassword = SHA256.HashPassword(dto.Password);
            User? userFromDb = await _context.Users
            .Where(u => u.UserName == dto.UserName)
            .FirstOrDefaultAsync();
            var listecik = await _context.Users.ToListAsync();

            if (userFromDb != null && userFromDb.Password.SequenceEqual(hashedPassword))
            {
                return NotFound(new { message = "Kullanıcı zaten var." });
            }

            await _context.Users.AddAsync(new User { UserName = dto.UserName, Password = hashedPassword, Email = dto.Email });
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
                var accessToken = JwtHelper.GenerateToken(dto.UserName,user.Id.ToString());
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
            await EmailService.SendResetCodeAsync("mehmetuygun1925@gmail.com", resetCode, prc);
            _resetCodeStore.AddCode(user.Email, resetCode);
            return Ok("Sıfırlama kodu mail adresine gönderildi.");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            bool control = _resetCodeStore.VerifyCode(dto.Email, dto.Code);

            if (control is false)
            {
                return BadRequest("Girdiğin kod hatalı veya süresi dolmuş.");
            }
            // 3. Eğer buraya geldiyse kod DOĞRUDUR. Şimdi DB'den kullanıcıyı bul
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null) return NotFound("Kullanıcı veri tabanında bulunamadı.");

            byte[] hashedPassword = SHA256.HashPassword(dto.NewPassword);
            user.Password = hashedPassword;
            await _context.SaveChangesAsync();
            _resetCodeStore.RemoveCode(dto.Email);
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

            var newAccessToken = JwtHelper.GenerateToken(user.UserName,user.Id.ToString());
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

        //[Authorize]
        //[HttpGet("/profil-bilgim")]
        //public IActionResult GetProfile()
        //{
        //    var username = User.Identity?.Name;

        //    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        //    return Ok(new
        //    {
        //        mesaj = $"Hoş geldin {username}!",
        //        id = userId
        //    });
        //}   

        [HttpGet("/deneme")]
        public async Task<IActionResult> Deneme()
        {
            var testUser = new LoginDto
            {
                UserName = "mehmet",
                Password = "12345",
            };
            var result = await Login(testUser);

            if (result is OkObjectResult okResult)
            {
                dynamic data = okResult.Value;
                string token = data.accessToken;
                using var client = new HttpClient();

                client.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

                var response = await client.GetStringAsync("https://localhost:7047/deneme1");

                return Ok($"İçeriden gelen cevap: {response}");
            }

            return BadRequest("Login başarısız oldu, token yok!");

            //var testUser = new ResetPasswordDto
            //{
            //    Email = "mehmetuygun1925@gmail.com",
            //    Code = 323801,
            //    NewPassword = "12345"
            //};
            //await ForgotPassword("mehmetuygun1925@gmail.com");
            //return await ResetPassword(testUser);
        }
        [HttpGet("/ekle")]
        public async Task<IActionResult> Ekle()
        {
            var testUser = new RegisterDto
            {
                UserName = "mehmet",
                Password = "123",
                Email = "mehmetuygun1925@gmail.com"
            };

            return await Register(testUser);
        }

        // Bu endpoint'e erişmek için geçerli bir JWT token'ına sahip olmanız gerekir. TEST İÇİN KULLANILACAKTIR, GERÇEK PROJEDE KALMAYACAKTIR.
        [Authorize]
        [HttpGet("/deneme1")]
        public async Task<IActionResult> Deneme1()
        {
            return Ok("Erişim başarılı! Geçerli bir token ile bu endpoint'e erişebildiniz.");
        }

    }
}
