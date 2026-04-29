namespace Backend.Models.DTOs
{
    public class AddWordDto
    {
        public required string EngWordName { get; set; }
        public required string TurWordName { get; set; }
        public string? Picture { get; set; }
        public required string Level { get; set; }

        public List<string> Samples { get; set; } = new();
    }
}
