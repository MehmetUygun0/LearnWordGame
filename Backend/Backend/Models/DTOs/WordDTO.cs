using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models.DTOs
{
    public class WordDTO
    {
        public int WordId { get; set; }
        public required string EngWordName { get; set; }
        public required string TurWordName { get; set; }
        public required string Level { get; set; }
        public virtual List<WordSampleDTO>? WordSamples { get; set; }
    }
}
