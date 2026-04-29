using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Backend.Models
{
    public class PasswordResetCode(string Email, int Code)
    {
        public string Email { get; private set; } = Email;
        public int Code { get; private set; } = Code;
        public DateTime ResetCodeExpiry = DateTime.UtcNow.AddMinutes(3);
    }
}
