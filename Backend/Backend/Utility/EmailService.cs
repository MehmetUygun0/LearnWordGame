using Backend.Models;
using System.Net;
using System.Net.Mail;

namespace Backend.Utility
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task SendResetCodeAsync(string email, int code, PasswordResetCode prc)
        {

            var referanceEmail = _configuration["Email:Address"];
            var password = _configuration["Email:Password"];
            var host = _configuration["Email:Host"];
            var port = _configuration.GetValue<int>("Email:Port");

            var smtpClient = new SmtpClient(host)
            {
                Port = port,
                Credentials = new NetworkCredential(referanceEmail, password),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress("LearnWordGame<learn@example.com>"),
                Subject = "Şifre Sıfırlama Kodu",
                Body = $"Şifreni sıfırlamak için kodun: {code}. Bu kod 10 dakika geçerlidir.",
                IsBodyHtml = true,
            };
            mailMessage.To.Add(email);

            await smtpClient.SendMailAsync(mailMessage);
        }
    }
}
