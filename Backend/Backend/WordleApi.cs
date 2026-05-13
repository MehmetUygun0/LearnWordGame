using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Concurrent;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WordleController : ControllerBase
    {
        private const int WordLength = 5;
        private static readonly WordleGameService GameService = new();
        private readonly AppDbContext _context;

        public WordleController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("new-game")]
        public async Task<IActionResult> NewGame()
        {
            var userId = GetCurrentUserId();

            if (userId is null)
            {
                return Unauthorized(new
                {
                    error = "Wordle bulmacasi icin giris yapmis bir kullanici gerekiyor."
                });
            }

            var answer = await GetRandomLearnedWordFromDatabase(userId.Value);

            if (answer is null)
            {
                return NotFound(new
                {
                    error = "Wordle icin kullanicinin ogrendigi 5 harfli Ingilizce kelime bulunamadi."
                });
            }

            var gameId = GameService.NewGame(answer);
            return Ok(new { gameId, wordLength = answer.Length, maxAttempts = GameState.MaxAttempts });
        }

        [HttpPost("guess")]
        public IActionResult Guess([FromBody] GuessRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.GameId) || string.IsNullOrWhiteSpace(request.Guess))
                return BadRequest(new { error = "gameId and guess are required." });

            var result = GameService.MakeGuess(request.GameId, NormalizeWord(request.Guess));

            if (result is null)
                return NotFound(new { error = "Game not found or already over." });

            return Ok(result);
        }

        private async Task<string?> GetRandomLearnedWordFromDatabase(int userId)
        {
            var words = await GetLearnedCandidateWords(userId);

            if (words.Count == 0)
                return null;

            return words[Random.Shared.Next(words.Count)];
        }

        private async Task<List<string>> GetLearnedCandidateWords(int userId)
        {
            var learnedWords = await _context.UserWordProgresses
                .AsNoTracking()
                .Where(progress => progress.UserId == userId && progress.IsLearned)
                .Select(progress => progress.Word!.EngWordName)
                .ToListAsync();

            return learnedWords
                .Select(NormalizeWord)
                .Where(IsWordleWord)
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();
        }

        private int? GetCurrentUserId()
        {
            var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(id, out var userId) ? userId : null;
        }

        private static string NormalizeWord(string word) =>
            word.Trim().ToLowerInvariant();

        private static bool IsWordleWord(string word) =>
            word.Length == WordLength && Regex.IsMatch(word, "^[a-z]+$");
    }

    public record GuessRequest(string GameId, string Guess);

    public record LetterResult(char Letter, string Status);

    public record GuessResult(
        List<LetterResult> Result,
        bool GameOver,
        bool Won,
        int AttemptsUsed,
        int MaxAttempts,
        string? Answer
    );

    public class GameState
    {
        public string Answer { get; init; } = "";
        public int Attempts { get; set; }
        public bool Over { get; set; }
        public bool Won { get; set; }
        public const int MaxAttempts = 6;
    }

    public class WordleGameService
    {
        private readonly ConcurrentDictionary<string, GameState> _games = new();

        public string NewGame(string answer)
        {
            var id = Guid.NewGuid().ToString("N")[..8];
            _games[id] = new GameState { Answer = answer };
            return id;
        }

        public GuessResult? MakeGuess(string gameId, string guess)
        {
            if (!_games.TryGetValue(gameId, out var state) || state.Over)
                return null;

            if (guess.Length != state.Answer.Length)
            {
                return new GuessResult(
                    Result: [],
                    GameOver: false,
                    Won: false,
                    AttemptsUsed: state.Attempts,
                    MaxAttempts: GameState.MaxAttempts,
                    Answer: null
                );
            }

            state.Attempts++;

            var letters = ScoreGuess(state.Answer, guess);
            var won = letters.All(letter => letter.Status == "correct");
            var over = won || state.Attempts >= GameState.MaxAttempts;

            state.Won = won;
            state.Over = over;

            return new GuessResult(
                Result: letters,
                GameOver: over,
                Won: won,
                AttemptsUsed: state.Attempts,
                MaxAttempts: GameState.MaxAttempts,
                Answer: over ? state.Answer : null
            );
        }

        private static List<LetterResult> ScoreGuess(string answer, string guess)
        {
            var result = new LetterResult[answer.Length];
            var remainingPool = answer.ToCharArray().ToList();

            for (var i = 0; i < answer.Length; i++)
            {
                if (guess[i] != answer[i])
                    continue;

                result[i] = new LetterResult(guess[i], "correct");
                remainingPool.Remove(answer[i]);
            }

            for (var i = 0; i < answer.Length; i++)
            {
                if (result[i] is not null)
                    continue;

                if (remainingPool.Contains(guess[i]))
                {
                    result[i] = new LetterResult(guess[i], "present");
                    remainingPool.Remove(guess[i]);
                }
                else
                {
                    result[i] = new LetterResult(guess[i], "absent");
                }
            }

            return [.. result];
        }
    }
}
