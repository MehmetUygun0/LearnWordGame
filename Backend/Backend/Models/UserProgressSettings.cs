using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public enum LevelStep
    {
        A1,
        A2,
        B1,
        B2,
        C1,
        C2
    }
    public class UserProgressSettings
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        public string UserLevel { get; set; } = LevelStep.A1.ToString();
        public DateTime LastDailyWord { get; set; } = DateTime.MinValue;
        public int TotalWordsLearned { get; set; } = 0;
        public int NumberOfNewWords { get; set; } = 10;
        public int SkipCount { get; set; } = 0;
    }
}
