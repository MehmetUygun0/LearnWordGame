using Backend.Data;
using Backend.Models;
using Backend.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;


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

        [HttpPost("forgotpswd")]
        public async Task<ActionResult> ForgotPassword(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);
            if (user is null)
                return NotFound(new { message = "Kullanıcı bulunamadı." });
            int resetCode = new Random().Next(100000, 999999);

            
            PasswordResetCode prc = new PasswordResetCode(user.Id,resetCode);

            await EmailService.SendResetCodeAsync("mehmetuygun1925@gmail.com", resetCode,prc);
            _resetCodeStore.AddCode(user.Id, resetCode);
            return Ok("Sıfırlama kodu mail adresine gönderildi.");
        }
        [HttpPost("register")]
        public async Task<ActionResult> Register(string username, string password, string email)
        {
            byte[] hashedPassword = SHA256.HashPassword(password);
            User? userFromDb = await _context.Users
            .Where(u => u.UserName == username)
            .FirstOrDefaultAsync();
            var listecik = await _context.Users.ToListAsync();

            if (userFromDb != null && userFromDb.Password.SequenceEqual(hashedPassword))
            {
                return NotFound(new { message = "Kullanıcı zaten var." });
            }

            await _context.Users.AddAsync(new User { UserName = username, Password = hashedPassword, Email=email });
            await _context.SaveChangesAsync();
            return Ok();
        }


        [HttpGet("login")]
        public async Task<IActionResult> Login(string username, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);


            if (user is null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı." });
            }
            byte[]? userPassword = user.Password;
            if (SHA256.VerifyPassword(password, userPassword))
            {
                var accessToken = JwtHelper.GenerateToken(username);
                var refreshToken = JwtHelper.GenerateRefreshToken();

                user.RefreshToken = refreshToken;
                user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(30);

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    accessToken,
                    refreshToken
                });

                //var token = JwtHelper.GenerateToken(username);
                //return Ok(new { token });

                //return Ok("Giriş Yapıldı");
            }
            else
            {
                return Unauthorized("Şifre hatalı.");
            }
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh(string refreshToken)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

            if (user == null || user.RefreshTokenExpiryTime < DateTime.UtcNow)
                return Unauthorized("Refresh token geçersiz");

            var newAccessToken = JwtHelper.GenerateToken(user.UserName);
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

        [HttpGet("/deneme")]
        public async Task<IActionResult> Deneme()
        {
            var result = await Login("mehmet", "123");
            return Ok(result);
        }
        [HttpGet("/ekle")]
        public async Task<IActionResult> Ekle()
        {
            return await Register("mehmet", "123","yarrrrrrak");
        }

        // Bu endpoint'e erişmek için geçerli bir JWT token'ına sahip olmanız gerekir. TEST İÇİN KULLANILACAKTIR, GERÇEK PROJEDE KALMAYACAKTIR.
        //[Authorize]
        [HttpGet("/deneme1")]
        public async Task<IActionResult> Deneme1()
        {
            return await ForgotPassword("mehmet");
        }

    }
}
