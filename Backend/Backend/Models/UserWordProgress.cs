using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public enum Step
    {
        Start = 0,
        Step1 = 1,
        Step2 = 2,
        Step3 = 3,
        Step4 = 4,
        Step5 = 5,
        Step6 = 6
    }
    public class UserWordProgress
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("Word")]
        public int WordId { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        public Word? Word { get; set; }
        [Range(0, 6)]
        public Step CurrentStep { get; set; } = Step.Start;
        [Column(TypeName = "date")]
        public DateTime? LastCorrectDate { get; set; } = null;
        public DateTime CreateAt { get; set; } = DateTime.UtcNow;//silinecek gibi
        public int ReviewCount { get; set; } = 0;
        [Column(TypeName = "date")]
        public DateTime? NextReviewDate { get; set; }
        public bool IsLearned { get; set; } = false;
    }
}
