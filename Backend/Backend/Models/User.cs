using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(80)]
        public required string UserName { get; set; }
        [Required]
        public required byte[] Password { get; set; }
        public DateTime CreatedAt { get; set; } =DateTime.Now;
    }
}
