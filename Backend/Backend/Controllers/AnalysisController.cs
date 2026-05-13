using Backend.Data;
using Backend.Models;
using Backend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnalysisController : BaseController
    {
        private readonly AppDbContext _context;
        private const int MaxStepValue = 6;

        public AnalysisController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet("report")]
        public async Task<IActionResult> GetReport()
        {
            int? userId = GetUserId();
            if (userId == null)
                return Unauthorized();

            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Id == userId.Value);
            if (user == null)
                return NotFound("Kullanici bulunamadi.");

            var settings = await _context.UserProgressSettings.AsNoTracking()
                .FirstOrDefaultAsync(x => x.UserId == userId.Value);

            var progresses = await _context.UserWordProgresses.AsNoTracking()
                .Where(x => x.UserId == userId.Value)
                .Include(x => x.Word)
                .ToListAsync();

            var userAddedWords = await _context.UserWords.AsNoTracking()
                .CountAsync(x => x.UserId == userId.Value);

            var report = BuildReport(user, settings, progresses, userAddedWords);
            return Ok(report);
        }

        private static AnalysisReportDto BuildReport(
            User user,
            UserProgressSettings? settings,
            List<UserWordProgress> progresses,
            int userAddedWords)
        {
            DateTime today = DateTime.UtcNow.Date;
            int totalTracked = progresses.Count;
            int learnedWords = progresses.Count(x => x.IsLearned);
            int activeWords = progresses.Count(x => !x.IsLearned);
            int readyForReviewWords = progresses.Count(x => x.NextReviewDate != null && x.NextReviewDate <= today);
            int correctlyRecalledWords = progresses.Count(x => x.LastCorrectDate != null);

            double averageProgressPercentage = totalTracked == 0
                ? 0
                : progresses.Average(x => ToProgressPercentage(x.CurrentStep, x.IsLearned));
            double estimatedKnowledgeScore = totalTracked == 0
                ? 0
                : progresses.Average(ToKnowledgeScore);

            double learnedPercentage = Percentage(learnedWords, totalTracked);
            double reviewHealthPercentage = totalTracked == 0
                ? 0
                : Math.Max(0, Math.Min(100, 100 - Percentage(readyForReviewWords, totalTracked)));
            double overallMasteryPercentage = totalTracked == 0
                ? 0
                : Math.Round((learnedPercentage * 0.45) + (averageProgressPercentage * 0.25) + (estimatedKnowledgeScore * 0.30), 1);

            List<AnalysisLevelBreakdownDto> levelBreakdown = progresses
                .Where(x => x.Word != null)
                .GroupBy(x => x.Word!.Level)
                .OrderBy(x => x.Key)
                .Select(group => new AnalysisLevelBreakdownDto
                {
                    Level = group.Key,
                    TotalWords = group.Count(),
                    LearnedWords = group.Count(x => x.IsLearned),
                    LearnedPercentage = Percentage(group.Count(x => x.IsLearned), group.Count()),
                    AverageKnowledgeScore = Math.Round(group.Average(ToKnowledgeScore), 1)
                })
                .ToList();

            List<AnalysisStageBreakdownDto> stageBreakdown = Enum.GetValues<Step>()
                .Select(step => new AnalysisStageBreakdownDto
                {
                    Stage = step.ToString(),
                    WordCount = progresses.Count(x => x.CurrentStep == step),
                    Percentage = Percentage(progresses.Count(x => x.CurrentStep == step), totalTracked)
                })
                .Where(x => x.WordCount > 0)
                .ToList();

            List<AnalysisWordLengthBreakdownDto> wordLengthBreakdown = new List<AnalysisWordLengthBreakdownDto>()
            {
                CreateWordLengthBucket("Kisa (1-4 harf)", progresses.Where(x => (x.Word?.EngWordName.Length ?? 0) <= 4).ToList()),
                CreateWordLengthBucket("Orta (5-6 harf)", progresses.Where(x => (x.Word?.EngWordName.Length ?? 0) >= 5 && (x.Word?.EngWordName.Length ?? 0) <= 6).ToList()),
                CreateWordLengthBucket("Uzun (7+ harf)", progresses.Where(x => (x.Word?.EngWordName.Length ?? 0) >= 7).ToList()),
            }.Where(x => x.WordCount > 0).ToList();

            List<AnalysisReviewBucketDto> reviewBuckets = new List<AnalysisReviewBucketDto>()
            {
                CreateReviewBucket("Gecmis tekrarlar", progresses.Count(x => x.NextReviewDate != null && x.NextReviewDate < today), totalTracked),
                CreateReviewBucket("Bugun tekrar edilmesi gerekenler", progresses.Count(x => x.NextReviewDate == today), totalTracked),
                CreateReviewBucket("Bu hafta gelecek tekrarlar", progresses.Count(x => x.NextReviewDate > today && x.NextReviewDate <= today.AddDays(7)), totalTracked),
                CreateReviewBucket("Daha sonraki tekrarlar", progresses.Count(x => x.NextReviewDate > today.AddDays(7)), totalTracked),
                CreateReviewBucket("Takvimlenmemis", progresses.Count(x => x.NextReviewDate == null), totalTracked),
            }.Where(x => x.WordCount > 0).ToList();

            List<AnalysisMetricDto> summaryMetrics = new()
            {
                new AnalysisMetricDto
                {
                    Label = "Genel ustalýk",
                    Percentage = overallMasteryPercentage,
                    Value = learnedWords,
                    Total = totalTracked,
                    Description = "Öðrenilen kelime oraný, adým ilerlemesi ve tahmini bilgi puaný birlestirildi."
                },
                new AnalysisMetricDto
                {
                    Label = "Öðrenildi oraný",
                    Percentage = learnedPercentage,
                    Value = learnedWords,
                    Total = totalTracked,
                    Description = "Tüm takip edilen kelimeler içinde tamamen oðrenilmiþ kabul edilenler."
                },
                new AnalysisMetricDto
                {
                    Label = "Tekrar saðlýðý",
                    Percentage = reviewHealthPercentage,
                    Value = totalTracked - readyForReviewWords,
                    Total = totalTracked,
                    Description = "Bekleyen tekrarlar ne kadar azsa bu oran o kadar yüksek olur."
                },
                new AnalysisMetricDto
                {
                    Label = "Doðru hatýrlama",
                    Percentage = Percentage(correctlyRecalledWords, totalTracked),
                    Value = correctlyRecalledWords,
                    Total = totalTracked,
                    Description = "En son hatýrlama sonucunda doðru kaydedilen kelimelerin oraný."
                }
            };

            List<string> strengths = BuildStrengths(levelBreakdown, wordLengthBreakdown, learnedWords, totalTracked, overallMasteryPercentage);
            List<string> focusAreas = BuildFocusAreas(levelBreakdown, reviewBuckets, activeWords, readyForReviewWords, totalTracked);
            List<string> recommendations = BuildRecommendations(settings, readyForReviewWords, totalTracked, activeWords, levelBreakdown);

            string currentLevel = settings?.UserLevel ?? "A1";
            string narrativeSummary = BuildNarrativeSummary(user.UserName, currentLevel, overallMasteryPercentage, learnedWords, totalTracked, readyForReviewWords, levelBreakdown, focusAreas);

            return new AnalysisReportDto
            {
                GeneratedAtUtc = DateTime.UtcNow,
                UserName = user.UserName,
                CurrentLevel = currentLevel,
                TotalTrackedWords = totalTracked,
                LearnedWords = learnedWords,
                ActiveWords = activeWords,
                ReadyForReviewWords = readyForReviewWords,
                CorrectlyRecalledWords = correctlyRecalledWords,
                UserAddedWords = userAddedWords,
                OverallMasteryPercentage = overallMasteryPercentage,
                LearnedPercentage = learnedPercentage,
                ReviewHealthPercentage = reviewHealthPercentage,
                AverageProgressPercentage = Math.Round(averageProgressPercentage, 1),
                EstimatedKnowledgeScore = Math.Round(estimatedKnowledgeScore, 1),
                SummaryMetrics = summaryMetrics,
                LevelBreakdown = levelBreakdown,
                StageBreakdown = stageBreakdown,
                WordLengthBreakdown = wordLengthBreakdown,
                ReviewBuckets = reviewBuckets,
                Strengths = strengths,
                FocusAreas = focusAreas,
                Recommendations = recommendations,
                NarrativeSummary = narrativeSummary,
            };
        }

        private static double ToProgressPercentage(Step step, bool isLearned)
        {
            if (isLearned)
                return 100;

            return Math.Round(((int)step / (double)MaxStepValue) * 100, 1);
        }

        private static double ToKnowledgeScore(UserWordProgress progress)
        {
            if (progress.IsLearned)
                return 100;

            double score = progress.CurrentStep switch
            {
                Step.Start => 18,
                Step.Step1 => 32,
                Step.Step2 => 48,
                Step.Step3 => 64,
                Step.Step4 => 78,
                Step.Step5 => 90,
                Step.Step6 => 100,
                _ => 0
            };

            if (progress.LastCorrectDate == null && progress.ReviewCount > 0)
                score -= 12;

            if (progress.NextReviewDate != null && progress.NextReviewDate < DateTime.UtcNow.Date)
                score -= 8;

            return Math.Max(0, Math.Min(100, Math.Round(score, 1)));
        }

        private static double Percentage(int value, int total)
        {
            if (total <= 0)
                return 0;

            return Math.Round((value / (double)total) * 100, 1);
        }

        private static AnalysisWordLengthBreakdownDto CreateWordLengthBucket(string label, List<UserWordProgress> items)
        {
            return new AnalysisWordLengthBreakdownDto
            {
                Group = label,
                WordCount = items.Count,
                AverageKnowledgeScore = items.Count == 0 ? 0 : Math.Round(items.Average(ToKnowledgeScore), 1)
            };
        }

        private static AnalysisReviewBucketDto CreateReviewBucket(string label, int count, int totalTracked)
        {
            return new AnalysisReviewBucketDto
            {
                Bucket = label,
                WordCount = count,
                Percentage = Percentage(count, totalTracked)
            };
        }

        private static List<string> BuildStrengths(
            List<AnalysisLevelBreakdownDto> levelBreakdown,
            List<AnalysisWordLengthBreakdownDto> wordLengthBreakdown,
            int learnedWords,
            int totalTracked,
            double overallMasteryPercentage)
        {
            List<string> strengths = new();

            AnalysisLevelBreakdownDto? bestLevel = levelBreakdown
                .OrderByDescending(x => x.AverageKnowledgeScore)
                .ThenByDescending(x => x.TotalWords)
                .FirstOrDefault();

            if (bestLevel != null && bestLevel.TotalWords > 0)
            {
                strengths.Add($"{bestLevel.Level} seviyesinde ortalama bilgi puanýn %{bestLevel.AverageKnowledgeScore}. Bu seviye þu an en güçlü alanýn.");
            }

            AnalysisWordLengthBreakdownDto? bestLengthGroup = wordLengthBreakdown
                .OrderByDescending(x => x.AverageKnowledgeScore)
                .FirstOrDefault();

            if (bestLengthGroup != null)
            {
                strengths.Add($"{bestLengthGroup.Group} kelimelerde ortalama bilgi puanýn %{bestLengthGroup.AverageKnowledgeScore}. Bu grupta daha rahat ilerliyorsun.");
            }

            if (learnedWords > 0 && totalTracked > 0)
            {
                strengths.Add($"Takip edilen {totalTracked} kelimenin {learnedWords} tanesi öðrenildi durumuna gelmiþ. Bu da uzun vadeli hafýzada istikrar gösterdiðini gösteriyor.");
            }

            if (overallMasteryPercentage >= 70)
            {
                strengths.Add("Genel ustalik puanýn güçlü bir seviyede. Mevcut tempoyu korursan bir üst seviyeye geçiþ daha rahat olacak.");
            }

            if (strengths.Count == 0)
            {
                strengths.Add("Rapor oluþturmak icin veri birikmeye baþladi. Birkaç gün daha düzenli tekrar yaptýðýnda güçlü alanlar daha net ayrýþacak.");
            }

            return strengths;
        }

        private static List<string> BuildFocusAreas(
            List<AnalysisLevelBreakdownDto> levelBreakdown,
            List<AnalysisReviewBucketDto> reviewBuckets,
            int activeWords,
            int readyForReviewWords,
            int totalTracked)
        {
            List<string> focusAreas = new();

            AnalysisLevelBreakdownDto? lowestLevel = levelBreakdown
                .OrderBy(x => x.AverageKnowledgeScore)
                .ThenByDescending(x => x.TotalWords)
                .FirstOrDefault();

            if (lowestLevel != null)
            {
                focusAreas.Add($"{lowestLevel.Level} seviyesinde ortalama bilgi puanýn %{lowestLevel.AverageKnowledgeScore}. Bu alan ekstra tekrar istiyor.");
            }

            AnalysisReviewBucketDto? overdueBucket = reviewBuckets
                .FirstOrDefault(x => x.Bucket == "Gecmis tekrarlar");

            if (overdueBucket != null && overdueBucket.WordCount > 0)
            {
                focusAreas.Add($"{overdueBucket.WordCount} kelimenin tekrar tarihi geçmiþ. Bekleyen tekrarlar biriktikçe kalýcýlýk zayýflayabilir.");
            }

            if (activeWords > 0 && totalTracked > 0)
            {
                focusAreas.Add($"{activeWords} kelime hala aktif öðrenme aþamasýnda. Bu kelimeler ustalik oranýný yukarý taþýmak için en kritik grup.");
            }

            if (readyForReviewWords == 0 && focusAreas.Count == 0)
            {
                focusAreas.Add("Þu anda kritik bir zayýf alan görünmüyor. Yeni kelime alýmýyla birlikte analiz daha detaylý hale gelecektir.");
            }

            return focusAreas;
        }

        private static List<string> BuildRecommendations(
            UserProgressSettings? settings,
            int readyForReviewWords,
            int totalTracked,
            int activeWords,
            List<AnalysisLevelBreakdownDto> levelBreakdown)
        {
            List<string> recommendations = new();

            if (readyForReviewWords > 0)
            {
                recommendations.Add($"Bugün önce bekleyen {readyForReviewWords} tekrar bitir. Sonra yeni kelimelere geçmen daha verimli olur.");
            }

            if (settings != null && settings.NumberOfNewWords >= 20 && activeWords > totalTracked / 2)
            {
                recommendations.Add("Günluk yeni kelime sayýn yüksek. Geçici olarak biraz düþürmek tekrar kalitesini artirabilir.");
            }

            AnalysisLevelBreakdownDto? weakestLevel = levelBreakdown.OrderBy(x => x.AverageKnowledgeScore).FirstOrDefault();
            if (weakestLevel != null)
            {
                recommendations.Add($"{weakestLevel.Level} seviyesindeki kelimeler için kýsa ama daha sýk tekrarlar planla.");
            }

            if (recommendations.Count == 0)
            {
                recommendations.Add("Mevcut tempoyu koru. Her gün düzenli olarak kýsa tekrar seanslarý yapmak bu ilerlemeyi destekler.");
            }

            return recommendations;
        }

        private static string BuildNarrativeSummary(
            string userName,
            string currentLevel,
            double overallMasteryPercentage,
            int learnedWords,
            int totalTracked,
            int readyForReviewWords,
            List<AnalysisLevelBreakdownDto> levelBreakdown,
            List<string> focusAreas)
        {
            string bestLevel = levelBreakdown
                .OrderByDescending(x => x.AverageKnowledgeScore)
                .Select(x => x.Level)
                .FirstOrDefault() ?? currentLevel;

            string firstFocus = focusAreas.FirstOrDefault()
                ?? "Mevcut tempoyu koruyarak yeni tekrarlarla ilerleyebilirsin.";

            return $"{userName} için üretilen bu raporda genel ustalýk puaný %{overallMasteryPercentage} olarak görünüyor. " +
                $"Takip edilen {totalTracked} kelimenin {learnedWords} tanesi kalýcý öðrenme aþamasýna ulaþýlmýþ. " +
                $"En güçlü görünen alan {bestLevel} seviyesi olurken, þu anda {readyForReviewWords} kelime tekrar bekliyor. " +
                $"{firstFocus}";
        }
    }
}
