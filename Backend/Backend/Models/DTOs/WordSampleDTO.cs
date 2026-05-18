using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs
{
    public class WordSampleDTO
    {
        public int Id { get; set; }
        public required string EngSamples { get; set; }
        public required string TurSamples { get; set; }
    }
}
