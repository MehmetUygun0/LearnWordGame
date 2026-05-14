using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Word
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(100)]
        public required string EngWordName { get; set; }
        [Required]
        [StringLength(100)]
        public required string TurWordName { get; set; }
        public string? Picture { get; set; } 
        [NotMapped]
        public string PictureUrl => $"/uploads/images/{Picture}";
        public virtual ICollection<WordSample> WordSamples { get; set; }
    }
}
