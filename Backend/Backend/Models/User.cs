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
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
    }
}
