using Backend.Models;

namespace Backend.Utility
{
    public class ResetCodeStore
    {
        // Thread-safe bir liste (Aynı anda birden fazla kişi kod isteyebilir)
        readonly public List<PasswordResetCode> Codes = new List<PasswordResetCode>();

        public void AddCode(int userId, int code)
        {
            // Varsa eskisini sil, yenisini ekle
            //Codes.RemoveAll(x => x.Email == email);
            Codes.Add(new PasswordResetCode(userId,code) );
        }
        public void IsCodeValid(int userId, int code)
        {
            Codes.Any(x => x.UserId == userId && x.Code == code);
        }
    }
}
