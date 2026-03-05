using Backend.Models;
using Backend.Utility;
using Microsoft.AspNetCore.Http;
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

        [HttpGet("/register")]
        public async Task<ActionResult> Register(string username, string password)
        {
            byte[] hashedPassword = SHA256.HashPassword(password);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username && u.Password.SequenceEqual(hashedPassword));
            if (user != null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı." });
            }

            _context.Users.Add(new User { UserName = username, Password = hashedPassword });
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
                return Ok();
            }
            else
            {
                return Unauthorized("Şifre hatalı.");
            }
        }
    }
}
