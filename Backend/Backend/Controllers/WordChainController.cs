using Backend.Data;
using Backend.Models;
using Backend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WordChainController : BaseController
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private const int RequiredWordCount = 5;
        private const string ComfyUiPromptUrl = "http://127.0.0.1:8000/prompt";
        private const string ComfyUiHistoryBaseUrl = "http://127.0.0.1:8000/history/";
        private const string OpenAiUrl = "https://api.openai.com/v1/responses";

        public WordChainController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        private async Task<string> GetStoryWithLLM(HashSet<string> words, string userLevel)
        {
            using HttpClient client = new HttpClient
            {
                Timeout = TimeSpan.FromSeconds(60)
            };
            string? apiKey = _configuration["OpenAI:ApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
                throw new InvalidOperationException("Word Chain hikaye servisi icin API anahtari eksik.");

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            var payload = new
            {
                model = "gpt-5.4-mini",
                input = $"Write an {userLevel} level story that includes the words {string.Join(", ", words)}",
                store = false
            };

            string jsonPayload = JsonSerializer.Serialize(payload);
            using StringContent content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
            HttpResponseMessage response = await client.PostAsync(OpenAiUrl, content);
            string responseString = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new InvalidOperationException("Word Chain hikayesi su anda olusturulamadi. Lutfen biraz sonra tekrar dene.");

            using JsonDocument doc = JsonDocument.Parse(responseString);
            JsonElement root = doc.RootElement;

            if (!root.TryGetProperty("output", out JsonElement outputElement) || outputElement.GetArrayLength() == 0)
                throw new InvalidOperationException("Hikaye cevabi bos geldi.");

            string? text = outputElement[0]
                .GetProperty("content")[0]
                .GetProperty("text")
                .GetString();

            if (string.IsNullOrWhiteSpace(text))
                throw new InvalidOperationException("Hikaye metni olusturulamadi.");

            return text.Trim();
        }

        private async Task<string> GetImagePathWithLLM(string text)
        {
            using HttpClient client = new HttpClient
            {
                Timeout = TimeSpan.FromSeconds(60)
            };

            string workflowPath = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.UserProfile),
                "Downloads",
                "ProjectAPI.json");

            if (!System.IO.File.Exists(workflowPath))
                throw new InvalidOperationException("Word Chain gorsel akisi icin workflow dosyasi bulunamadi.");

            string workflowText = await System.IO.File.ReadAllTextAsync(workflowPath);
            JsonNode? workflow = JsonNode.Parse(workflowText);
            if (workflow == null)
                throw new InvalidOperationException("Word Chain gorsel workflow'u okunamadi.");

            if (workflow["6"]?["inputs"]?["text"] == null)
                throw new InvalidOperationException("Word Chain workflow yapisi beklenen formatta degil.");

            workflow["6"]!["inputs"]!["text"] = $"{text}, 256x256";

            var requestData = new
            {
                prompt = workflow
            };

            string json = JsonSerializer.Serialize(requestData);
            using StringContent content = new StringContent(json, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync(ComfyUiPromptUrl, content);
            string result = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new InvalidOperationException("Word Chain gorseli su anda olusturulamadi. ComfyUI servisini kontrol et.");

            using JsonDocument promptDocument = JsonDocument.Parse(result);
            string? promptId = promptDocument.RootElement.GetProperty("prompt_id").GetString();
            if (string.IsNullOrWhiteSpace(promptId))
                throw new InvalidOperationException("Gorsel olusturma istegi baslatilamadi.");

            string historyResponse = string.Empty;
            int attempts = 0;

            while ((string.IsNullOrWhiteSpace(historyResponse) || historyResponse == "{}") && attempts < 45)
            {
                historyResponse = await client.GetStringAsync(ComfyUiHistoryBaseUrl + promptId);
                attempts++;

                if (string.IsNullOrWhiteSpace(historyResponse) || historyResponse == "{}")
                    await Task.Delay(1000);
            }

            if (string.IsNullOrWhiteSpace(historyResponse) || historyResponse == "{}")
                throw new InvalidOperationException("Gorsel olusturma zaman asimina ugradi.");

            using JsonDocument historyDocument = JsonDocument.Parse(historyResponse);
            JsonElement rootObject = historyDocument.RootElement;
            string? fileName = null;

            foreach (JsonProperty item in rootObject.EnumerateObject())
            {
                if (item.Value.TryGetProperty("outputs", out JsonElement outputsElement)
                    && outputsElement.TryGetProperty("9", out JsonElement nodeElement)
                    && nodeElement.TryGetProperty("images", out JsonElement imagesElement)
                    && imagesElement.ValueKind == JsonValueKind.Array
                    && imagesElement.GetArrayLength() > 0)
                {
                    fileName = imagesElement[0].GetProperty("filename").GetString();
                    break;
                }
            }

            if (string.IsNullOrWhiteSpace(fileName))
                throw new InvalidOperationException("Olusan gorsel dosyasi bulunamadi.");

            string documentsPath = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
            string imagePath = Path.Combine(documentsPath, "ComfyUI", "output", fileName);

            if (!System.IO.File.Exists(imagePath))
                throw new InvalidOperationException("Olusan gorsel dosyasi diskte bulunamadi.");

            return imagePath;
        }

        [Authorize]
        [HttpGet("get-word-chain")]
        public async Task<IActionResult> GetWordChain()
        {
            try
            {
                int? userId = GetUserId();
                if (userId == null)
                    return Unauthorized();

                UserProgressSettings? userProgressSettings = await _context.UserProgressSettings
                    .FirstOrDefaultAsync(x => x.UserId == userId.Value);

                if (userProgressSettings == null)
                {
                    userProgressSettings = new UserProgressSettings
                    {
                        UserId = userId.Value
                    };

                    await _context.UserProgressSettings.AddAsync(userProgressSettings);
                    await _context.SaveChangesAsync();
                }

                List<string> candidateWords = await _context.UserWordProgresses
                    .AsNoTracking()
                    .Where(x => x.UserId == userId.Value && x.Word != null)
                    .Select(x => x.Word!.EngWordName)
                    .Distinct()
                    .ToListAsync();

                if (candidateWords.Count < RequiredWordCount)
                {
                    return BadRequest(new
                    {
                        message = "Word Chain olusturmak icin once en az 5 kelime ogrenmis olman gerekiyor."
                    });
                }

                Random rnd = new Random();
                HashSet<string> selectedWords = new HashSet<string>();

                while (selectedWords.Count < RequiredWordCount)
                {
                    int randomIndex = rnd.Next(candidateWords.Count);
                    selectedWords.Add(candidateWords[randomIndex]);
                }

                string story = await GetStoryWithLLM(selectedWords, userProgressSettings.UserLevel);
                string imagePath = await GetImagePathWithLLM(story);
                byte[] imageBytes = await System.IO.File.ReadAllBytesAsync(imagePath);

                return Ok(new
                {
                    story,
                    image = Convert.ToBase64String(imageBytes)
                });
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, new
                {
                    message = ex.Message
                });
            }
            catch (TaskCanceledException)
            {
                return StatusCode(StatusCodes.Status504GatewayTimeout, new
                {
                    message = "Word Chain istegi zaman asimina ugradi. Lutfen tekrar dene."
                });
            }
            catch (HttpRequestException)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, new
                {
                    message = "Word Chain servislerine su anda ulasilamiyor. Lutfen daha sonra tekrar dene."
                });
            }
            catch (JsonException)
            {
                return StatusCode(StatusCodes.Status502BadGateway, new
                {
                    message = "Word Chain cevabi beklenen formatta gelmedi."
                });
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    message = "Word Chain olusturulurken beklenmeyen bir hata olustu."
                });
            }
        }
    }
}
