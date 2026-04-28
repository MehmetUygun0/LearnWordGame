using Backend.Data;
using Backend.Models;
using Backend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WordController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WordController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpPost("add")]
        public async Task<IActionResult> AddWord([FromBody] AddWordDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1");
            if (userId == -1)
                return Unauthorized("Refresh token geçersiz veya süresi dolmuş.");

            UserWord word = new UserWord
            {
                UserId = userId,
                EngWordName = dto.EngWordName,
                TurWordName = dto.TurWordName,
                Picture = dto.Picture,
                Level = "FromUsers",
                WordSamples = dto.Samples.Select(s => new UserWordSample
                {
                    Sample = s,
                }).ToList()

            };
            var username = HttpContext.User.Identity?.Name;

            //var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            //    return Ok(new
            //    {
            //        mesaj = $"Hoş geldin {username}!",
            //        id = userId
            //    });

            _context.UserWords.Add(word);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Word added successfully",
                word.Id
            });
        }
        [HttpGet("/ekleword")]
        public async Task<IActionResult> Tetst()
        {
            var nesne = new AddWordDto
            {
                EngWordName = "Test",
                TurWordName = "Test",
                Picture = null,
                Level = "A1",
                Samples = new List<string> { "This is a test sample." }
            };
            return  await AddWord(nesne);
        }
    }
}
