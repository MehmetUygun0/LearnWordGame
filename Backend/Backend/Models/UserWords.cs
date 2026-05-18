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

        [MaxLength(20)]
        public string Level { get; set; } = "UserAdded";
    }
}
