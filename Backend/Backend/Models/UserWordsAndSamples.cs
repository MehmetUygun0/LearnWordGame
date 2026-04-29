using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class UserWord
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; } 

        [Required]
        [StringLength(100)]
        public string EngWordName { get; set; } = null!;

        [Required]
        [StringLength(100)]
        public string TurWordName { get; set; } = null!;

        public string? Picture { get; set; }

        [MaxLength(20)]
        public string Level { get; set; } = "UserAdded";

        public virtual ICollection<UserWordSample> WordSamples { get; set; } = new List<UserWordSample>();
    }

    public class UserWordSample
    {
        [Key]
        public int Id { get; set; }
        public int UserWordId { get; set; }
        public string Sample { get; set; } = null!;

        public virtual UserWord UserWord { get; set; } = null!;
    }
}
