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
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Word word = new Word
            {
                EngWordName = dto.EngWordName.Trim(),
                TurWordName = dto.TurWordName.Trim(),
                Level = string.IsNullOrWhiteSpace(dto.Level) ? "A1" : dto.Level.Trim(),
                Picture = dto.Picture
            };

            _context.Words.Add(word);
            await _context.SaveChangesAsync();

            var samples = dto.Samples
                .Where(sample => !string.IsNullOrWhiteSpace(sample))
                .Select(sample => new WordSample
                {
                    WordID = word.Id,
                    EngSamples = sample.Trim(),
                    TurSamples = string.Empty
                })
                .ToList();

            if (samples.Count > 0)
                await _context.WordSamples.AddRangeAsync(samples);

            UserWord userWord = new UserWord
            {
                UserId = (int)userId,
                EngWordName = word.EngWordName,
                TurWordName = word.TurWordName,
                Level = word.Level
            };

            bool hasProgress = await _context.UserWordProgresses
                .AnyAsync(progress => progress.UserId == userId && progress.WordId == word.Id);

            if (!hasProgress)
            {
                await _context.UserWordProgresses.AddAsync(new UserWordProgress
                {
                    UserId = userId.Value,
                    WordId = word.Id,
                    CurrentStep = Step.Start,
                    ReviewCount = 0,
                    NextReviewDate = DateTime.UtcNow.Date
                });
            }

            _context.UserWords.Add(userWord);
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

            var userId = GetUserId();
            if (userId == null)
                return Unauthorized();
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

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
        [HttpPost("daily-word")]
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

            var today = DateTime.UtcNow.Date;
            var lastProgressWords = await _context.UserWordProgresses
                .Where(x => x.UserId == userId && !x.IsLearned && x.NextReviewDate <= today && x.Word != null)
                .Include(x => x.Word!).ThenInclude(w => w.WordSamples)
                .OrderBy(x => x.NextReviewDate).ThenBy(x => x.ReviewCount)
                .ToListAsync();

            int lastReviewCount = lastProgressWords.Count() == 0 ? 0 : lastProgressWords.First().ReviewCount;
            DateTime? lastNextReviewDate = lastProgressWords.Count() == 0 ? DateTime.MinValue : lastProgressWords.First().NextReviewDate;


            var necessarylastProgressWords = lastProgressWords.Where(x => x.ReviewCount == lastReviewCount && x.NextReviewDate == lastNextReviewDate).Select(word => new WordDTO
            {
                WordId = word.WordId,
                EngWordName = word.Word!.EngWordName,
                TurWordName = word.Word.TurWordName,
                Level = word.Word.Level,
                WordSamples = word.Word.WordSamples.Select(s => new WordSampleDTO
                {
                    Id = s.Id,
                    EngSamples = s.EngSamples,
                    TurSamples = s.TurSamples
                }).ToList()
            }).ToList();


            var trackedWordIds = await _context.UserWordProgresses
                .Where(x => x.UserId == userId)
                .Select(x => x.WordId)
                .ToListAsync();

            List<WordDTO> newWords = new();

            if (userProgressSetting.LastDailyWord.Date < today)
            {
                newWords = await _context.Words.AsNoTracking()
                    .Include(w => w.WordSamples)
                    .Where(x => x.Level == userProgressSetting.UserLevel && !trackedWordIds.Contains(x.Id))
                    .OrderBy(x => x.Id)
                    .Take(userProgressSetting.NumberOfNewWords)
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
                    }).ToListAsync();

                var userWordProgresses = newWords.Select(word => new UserWordProgress
                {
                    WordId = word.WordId,
                    UserId = userId.Value,
                    CurrentStep = Step.Start,
                    LastCorrectDate = null,
                    NextReviewDate = today,
                }).ToList();

                await _context.UserWordProgresses.AddRangeAsync(userWordProgresses);
                userProgressSetting.LastDailyWord = today;
            }

            await _context.SaveChangesAsync();

            var result = necessarylastProgressWords.Concat(newWords).ToList();
            return Ok(result);
        }
        DateTime GetNextReviewDate(Step step)
        {
            return step switch
            {
                Step.Start => DateTime.UtcNow.Date.AddDays(1),
                Step.Step1 => DateTime.UtcNow.Date.AddDays(7),
                Step.Step2 => DateTime.UtcNow.Date.AddMonths(1),
                Step.Step3 => DateTime.UtcNow.Date.AddMonths(3),
                Step.Step4 => DateTime.UtcNow.Date.AddMonths(6),
                Step.Step5 => DateTime.UtcNow.Date.AddYears(1),
                _ => DateTime.UtcNow.Date.AddDays(1)
            };
        }
        [Authorize]
        [HttpPost("test-result")]
        public async Task<IActionResult> SaveTestResult([FromBody] List<WordTestResultDTO> dto)//günlük kelimelerin test sonuçlarını kaydedecek.
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized();
            
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var wordIds = dto.Select(x => x.WordId).ToList();
            var progresses = await _context.UserWordProgresses
            .Where(x => x.UserId == userId && wordIds.Contains(x.WordId))
            .ToDictionaryAsync(x => x.WordId);

            foreach (var dtoItem in dto)
            {
                if (!progresses.TryGetValue(dtoItem.WordId, out var progressItem))
                {
                    progressItem = new UserWordProgress
                    {
                        UserId = (int)userId,
                        WordId = dtoItem.WordId,
                        CurrentStep = Step.Start,
                        ReviewCount = 0
                    };
                    _context.UserWordProgresses.Add(progressItem);
                }

                if (progressItem.IsLearned)
                    continue;

                if (dtoItem.IsCorrect)
                {
                    Step nextStep = progressItem.CurrentStep + 1;
                    progressItem.LastCorrectDate = DateTime.UtcNow.Date;
                    progressItem.NextReviewDate = nextStep > Step.Step5 ? null : GetNextReviewDate(progressItem.CurrentStep);
                    progressItem.CurrentStep = nextStep;
                    progressItem.ReviewCount += 1;
                    progressItem.IsLearned = nextStep >= Step.Step6;
                }
                else
                {
                    progressItem.LastCorrectDate = null;
                    progressItem.NextReviewDate = DateTime.UtcNow.Date;
                    progressItem.CurrentStep = Step.Start;
                    progressItem.ReviewCount = 0;
                    progressItem.IsLearned = false;
                }
            }

            await _context.SaveChangesAsync();

            UserProgressSettings? settings = await _context.UserProgressSettings
                .FirstOrDefaultAsync(x => x.UserId == userId.Value);

            if (settings != null)
            {
                settings.TotalWordsLearned = await _context.UserWordProgresses
                    .CountAsync(x => x.UserId == userId.Value && x.IsLearned);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }


    }
}
