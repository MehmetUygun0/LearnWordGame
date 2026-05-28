namespace Backend.Models.DTOs
{
    public class AddWordDto
    {
        public required string EngWordName { get; set; }
        public required string TurWordName { get; set; }
        public required string Level { get; set; } = "FromUsers";
        public string? Picture { get; set; }
        public List<string> Samples { get; set; } = new();
    }
}
