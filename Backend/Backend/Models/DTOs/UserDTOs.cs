namespace Backend.Models.DTOs
{
    public class ForgotPasswordDto
    {
        public string Email { get; set; }
    }

    public class ResetPasswordDto
    {
        public required string Email { get; set; }
        public required int Code { get; set; }
        public required string NewPassword { get; set; }
    }

    public class LoginDto
    {
        public required string UserName { get; set; }
        public required string Password { get; set; }
    }
    public class RegisterDto
    {
        public required string UserName { get; set; }
        public required string Password { get; set; }
        public required string Email { get; set; }
    }
    public class RefreshTokenDto
    {
        public required string AccessToken { get; set; }
        public required string RefreshToken { get; set; }
    }
}
