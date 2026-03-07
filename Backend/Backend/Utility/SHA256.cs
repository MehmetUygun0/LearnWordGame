namespace Backend.Utility
{
    static public class SHA256
    {
        public static byte[] HashPassword(string password)
        {
            using (var sha256 = System.Security.Cryptography.SHA256.Create())
            {
                return sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
        public static bool VerifyPassword(string password, byte[] hash)
        {
            byte[] computedHash = HashPassword(password);
            return computedHash.SequenceEqual(hash);
        }
    }
}
