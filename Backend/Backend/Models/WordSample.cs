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
        public required string Samples { get; set; } // Örnek cümle

        public virtual Word Word { get; set; }
    }
}
