using Backend.Models;

namespace Backend.Utility
{
    public class ResetCodeStore
    {
        // Thread-safe bir liste (Aynı anda birden fazla kişi kod isteyebilir)
        readonly public List<PasswordResetCode> Codes = new List<PasswordResetCode>();

        public void AddCode(string email, int code)
        {
            Codes.Add(new PasswordResetCode(email,code) );
        }
        public bool VerifyCode(string email,int code)
        {
           var item = Codes.LastOrDefault(x => x.Email == email && x.Code == code);
           if(item!=null && item.ResetCodeExpiry<DateTime.Now) return true;
           return false;
        }
        public void RemoveCode(string email)
        {
            var items = Codes.Where(x=>x.Email==email).ToList();
            if(items.Count == 0) return;
            foreach(var item in items)
            {
                Codes.Remove(item);
            }
        }
    }
}
