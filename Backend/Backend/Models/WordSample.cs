using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class WordSample
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int WordID { get; set; }

        [Required]
        public required string EngSamples { get; set; }
        [Required]
        public required string TurSamples { get; set; }

        public virtual Word? Word { get; set; }
    }
}
