using Backend.Data;
using Backend.Models;
using Backend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WordController : BaseController
    {
        private readonly AppDbContext _context;

        public WordController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpPost("add")]
        public async Task<IActionResult> AddWord([FromBody] AddWordDto dto)//kullanıcı kelime eklerken bu endpointi kullanacak
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
                Level = "FromUsers"
            };
            var username = HttpContext.User.Identity?.Name;

            _context.UserWords.Add(word);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Word added successfully",
                word.Id
            });
        }
        [Authorize]
        [HttpGet("get-myword")]
        public async Task<IActionResult> GetUsersWord()//kullanıcının eklediği kelimeleri getiri.
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1");
            if (userId == -1)
                return Unauthorized("Refresh token geçersiz veya süresi dolmuş.");

            return Ok(await _context.UserWords.Where(x => x.UserId == userId).Select(x => new WordDTO
            {
                Level = x.Level,
                WordId = x.Id,
                EngWordName = x.EngWordName,
                TurWordName = x.TurWordName,
                WordSamples = null
            }).ToListAsync());
        }

        [Authorize]
        [HttpGet("daily-word")]
        public async Task<IActionResult> DailyWord()//kullanıcı günlük kelimelerini bu endpointten alacak
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized();

            UserProgressSettings? userProgressSetting = await _context.UserProgressSettings.FirstOrDefaultAsync(x => x.UserId == userId);
            if (userProgressSetting == null)
            {
                userProgressSetting = new UserProgressSettings
                {
                    UserId = (int)userId,
                };
                await _context.UserProgressSettings.AddAsync(userProgressSetting);
                await _context.SaveChangesAsync();
            }

            var lastProgressWords = await _context.UserWordProgresses
                .Where(x => x.UserId == userId && x.NextReviewDate <= DateTime.UtcNow.Date)
                .Include(x => x.Word).ThenInclude(w => w.WordSamples)
                .OrderBy(x => x.NextReviewDate).ThenBy(x => x.ReviewCount)
                .ToListAsync();

            int lastReviewCount = lastProgressWords.Count() == 0 ? 0 : lastProgressWords.First().ReviewCount;
            DateTime? lastNextReviewDate = lastProgressWords.Count() == 0 ? lastProgressWords.First().NextReviewDate : DateTime.MinValue;


            var necessarylastProgressWords = lastProgressWords.Where(x => x.ReviewCount == lastReviewCount && x.NextReviewDate == lastNextReviewDate).Select(word => new WordDTO
            {
                WordId = word.WordId,
                EngWordName = word.Word.EngWordName,
                TurWordName = word.Word.TurWordName,
                Level = word.Word.Level,
                WordSamples = word.Word.WordSamples.Select(s => new WordSampleDTO
                {
                    Id = s.Id,
                    EngSamples = s.EngSamples,
                    TurSamples = s.TurSamples
                }).ToList()
            }).ToList();


            var newWords = _context.Words.AsNoTracking().Include(w => w.WordSamples).Where(x => x.Level == userProgressSetting.UserLevel)
            .Skip(userProgressSetting.SkipCount).Take(userProgressSetting.NumberOfNewWords)
            .Select(w => new WordDTO
            {
                WordId = w.Id,
                EngWordName = w.EngWordName,
                TurWordName = w.TurWordName,
                Level = w.Level,
                WordSamples = w.WordSamples.Select(s => new WordSampleDTO
                {
                    Id = s.Id,
                    EngSamples = s.EngSamples,
                    TurSamples = s.TurSamples
                }).ToList()
            }).ToList();
            userProgressSetting.SkipCount += userProgressSetting.NumberOfNewWords;

            DateTime GetNextReviewDate(Step step)
            {
                return step switch
                {
                    Step.Start => DateTime.UtcNow.AddDays(1),
                    Step.Step1 => DateTime.UtcNow.AddDays(5),
                    Step.Step2 => DateTime.UtcNow.AddDays(7),
                    Step.Step3 => DateTime.UtcNow.AddDays(21),
                    Step.Step4 => DateTime.UtcNow.AddMonths(1),
                    Step.Step5 => DateTime.UtcNow.AddMonths(2),
                    _ => DateTime.UtcNow.AddDays(1)
                };
            }

            var userWordProgresses = newWords.Select(word => new UserWordProgress
            {
                WordId = word.WordId,
                UserId = userId.Value,
                CurrentStep = Step.Start,
                LastCorrectDate = null,
                NextReviewDate = GetNextReviewDate(Step.Start),
            }).ToList();

            await _context.UserWordProgresses.AddRangeAsync(userWordProgresses);
            await _context.SaveChangesAsync();

            var result = necessarylastProgressWords.Concat(newWords).ToList();
            return Ok(result);
        }
        [Authorize]
        [HttpPost("test-result")]
        public async Task<IActionResult> SaveTestResult([FromBody] List<WordTestResultDTO> dto)//günlük kelimelerin test sonuçlarını kaydedecek.
        {
            DateTime GetNextReviewDate(Step step)
            {
                return step switch
                {
                    Step.Start => DateTime.UtcNow.AddDays(1),
                    Step.Step1 => DateTime.UtcNow.AddDays(5),
                    Step.Step2 => DateTime.UtcNow.AddDays(7),
                    Step.Step3 => DateTime.UtcNow.AddDays(21),
                    Step.Step4 => DateTime.UtcNow.AddMonths(1),
                    Step.Step5 => DateTime.UtcNow.AddMonths(2),
                    _ => DateTime.UtcNow.AddDays(1)
                };
            }
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "-1");
            if (userId == -1)
                return Unauthorized("Refresh token geçersiz veya süresi dolmuş.");

            var wordIds = dto.Select(x => x.WordId).ToList();
            var progresses = await _context.UserWordProgresses
            .Where(x => x.UserId == userId && wordIds.Contains(x.WordId))
            .ToListAsync();
            foreach (var (progressItem, dtoItem) in progresses.Zip(dto, (p, d) => (p, d)))
            {
                progressItem.LastCorrectDate = dtoItem.IsCorrect ? DateTime.UtcNow : (DateTime?)null;
                progressItem.NextReviewDate = dtoItem.IsCorrect ? GetNextReviewDate(progressItem.CurrentStep) : DateTime.UtcNow.AddDays(2);
                progressItem.CurrentStep = dtoItem.IsCorrect ? progressItem.CurrentStep + 1 : Step.Start;
                progressItem.ReviewCount += dtoItem.IsCorrect ? 1 : 0;
                progressItem.IsLearned = progressItem.CurrentStep > Step.Step5;
            }
            await _context.SaveChangesAsync();
            return Ok();
        }


    }
}
