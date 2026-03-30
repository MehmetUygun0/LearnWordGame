using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Backend.Models
{
    public class PasswordResetCode(int UserId, int Code)
    {
        public int UserId { get; private set; } = UserId;
        public int Code { get; private set; } = Code;
        public DateTime ResetCodeExpiry = DateTime.UtcNow.AddMinutes(3);
    }
}
