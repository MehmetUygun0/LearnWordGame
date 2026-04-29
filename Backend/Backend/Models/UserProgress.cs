using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class UserProgress
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        public string UserLevel { get; set; } = "A1";
        public int TotalWordsLearned { get; set; } = 0;
        public int NumberOfNewWords { get; set; } = 10;

    }
}
