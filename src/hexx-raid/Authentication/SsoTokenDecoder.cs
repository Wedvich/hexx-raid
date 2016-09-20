using System;
using System.IO;
using System.Linq;
using System.Security;
using System.Security.Cryptography;
using System.Text;

namespace hexx_raid.Authentication
{
    public class SsoTokenDecoder
    {
        private const string InvalidSsoTokenMessage = "SSO token is invalid.";

        private readonly byte[] _key;

        public SsoTokenDecoder(string key)
        {
            _key = Utilities.HexToBytes(key);
        }

        public SsoToken Decode(string token)
        {
            var bytes = Convert.FromBase64String(token);
            var iv = bytes.Take(16).ToArray();
            var ciphertext = bytes.Skip(16).ToArray();
            var plaintextBytes = new byte[ciphertext.Length];

            using (var aes = Aes.Create())
            {
                aes.Mode = CipherMode.CBC;
                aes.Padding = PaddingMode.None;
                aes.Key = _key;
                aes.IV = iv;

                using (var ms = new MemoryStream(ciphertext))
                using (var cs = new CryptoStream(ms, aes.CreateDecryptor(), CryptoStreamMode.Read))
                {
                    cs.Read(plaintextBytes, 0, plaintextBytes.Length);
                }
            }

            var plaintext = Encoding.UTF8.GetString(plaintextBytes.TakeWhile(b => b != 0x00).ToArray());

            var tokenFragments = plaintext.Split(';');
            if (tokenFragments.Length != 3 || tokenFragments.Any(string.IsNullOrWhiteSpace))
            {
                throw new SecurityException(InvalidSsoTokenMessage);
            }

            long expiry;
            if (!long.TryParse($"{tokenFragments[0]}000", out expiry))
            {
                throw new SecurityException(InvalidSsoTokenMessage);
            }

            int id;
            if (!int.TryParse(tokenFragments[1], out id))
            {
                throw new SecurityException(InvalidSsoTokenMessage);
            }

            return new SsoToken
            {
                Expiry = DateTimeOffset.FromUnixTimeMilliseconds(expiry),
                Id = id,
                Username = tokenFragments[2]
            };
        }
    }
}
