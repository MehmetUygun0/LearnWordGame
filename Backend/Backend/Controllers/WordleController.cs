using Backend.Data;
using Backend.Models;
using Backend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Concurrent;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WordleController : BaseController
    {
        private const int WordLengthFloor = 4;
        private const int WordLengthTop = 5;
        private readonly AppDbContext _context;

        public WordleController(AppDbContext context)
        {
            _context = context;
        }
        [Authorize]
        [HttpGet("new-game")]
        public async Task<IActionResult> NewGame()
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized();
            return Ok(await GetRandomWordFromDatabase((int)userId));
        }

        private async Task<WordleDTO> GetRandomWordFromDatabase(int id)
        {
            Random rnd = new Random();
            IQueryable<Word?> query = _context.UserWordProgresses.AsQueryable().AsNoTracking()
                .Where(x => x.UserId == id).Select(x => x.Word)
                .Where(x => x.EngWordName.Length >= WordLengthFloor && x.EngWordName.Length <= WordLengthTop);

            int wordCount = await query.CountAsync();
            int randomIndex = rnd.Next(wordCount);
            var randomWord = await query.Select(x => new WordleDTO { EngWordName = x.EngWordName }).Skip(randomIndex).FirstOrDefaultAsync();
            return randomWord ?? new WordleDTO { EngWordName = "error" };
        }
    }
}
