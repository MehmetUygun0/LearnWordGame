using Backend.Models;
using System.Net;
using System.Net.Mail;

namespace Backend.Utility
{
    static public class EmailService
    {
        static public async Task SendResetCodeAsync(string email, int code, PasswordResetCode prc)
        {
            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential("hoppacik1925@gmail.com", "lfslugdvdgasmxjd"),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress("hoppacik1925@gmail.com"),
                Subject = "Şifre Sıfırlama Kodu",
                Body = $"Şifreni sıfırlamak için kodun: {code}. Bu kod 10 dakika geçerlidir.",
                IsBodyHtml = true,
            };
            mailMessage.To.Add(email);

            await smtpClient.SendMailAsync(mailMessage);

        }
        
    }
}
