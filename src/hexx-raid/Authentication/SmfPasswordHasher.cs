using System.Security.Cryptography;
using System.Text;

namespace hexx_raid.Authentication
{
    public class SmfPasswordHasher
    {
        public string Hash(string username, string password)
        {
            using (var sha1 = SHA1.Create())
            {
                var bytes = Encoding.UTF8.GetBytes($"{username.ToLowerInvariant()}{password}");
                var hashBytes = sha1.ComputeHash(bytes);
                return Utilities.BytesToHex(hashBytes);
            }
        }
    }
}
