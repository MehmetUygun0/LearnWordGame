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
        public UserController(AppDbContext appContext)
        {
            _context = appContext;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(string username, string password)
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

            await _context.Users.AddAsync(new User { UserName = username, Password = hashedPassword });
            await _context.SaveChangesAsync();
            return Ok();
        }


        [HttpGet("login")]
        public async Task<IActionResult> Login(string username, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);

            byte[]? userPassword = user.Password;

            if (userPassword is null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı." });
            }
            else if (SHA256.VerifyPassword(password, userPassword))
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

        // Bu endpoint'e erişmek için geçerli bir JWT token'ına sahip olmanız gerekir. TEST İÇİN KULLANILACAKTIR, GERÇEK PROJEDE KALMAYACAKTIR.
        [Authorize]
        [HttpGet("/deneme1")]
        public async Task<IActionResult> Deneme1()
        {
            return Ok("Olduuu");
        }
        
    }
}
