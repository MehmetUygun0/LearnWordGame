using Backend.Models;
using Backend.Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        [HttpPost("/register")]
        public async Task<ActionResult> Register(string username, string password)
        {
            byte[] hashedPassword = SHA256.HashPassword(password);
            User? userFromDb = await _context.Users
            .Where(u => u.UserName == username)
            .FirstOrDefaultAsync();

            if (userFromDb != null && userFromDb.Password.SequenceEqual(hashedPassword))
            {
                return NotFound(new { message = "Kullanıcı zaten var." });
            }

            await _context.Users.AddAsync(new User { UserName = username, Password = hashedPassword });
            await _context.SaveChangesAsync();
            return Ok();
        }


        [HttpGet("/login")]
        public async Task<IActionResult> Login(string username, string password)
        {
            byte[]? userPassword = await _context.Users.Where(u => u.UserName == username)
            .Select(u => u.Password).FirstOrDefaultAsync();

            if (userPassword is null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı." });
            }
            else if (SHA256.VerifyPassword(password, userPassword))
            {
                return Ok("Giriş Yapıldı");
            }
            else
            {
                return Unauthorized("Şifre hatalı.");
            }
        }
    }
}
