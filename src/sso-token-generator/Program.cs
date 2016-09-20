using System;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using hexx_raid;
using Microsoft.Extensions.Configuration;

namespace sso_token_generator
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .AddUserSecrets("aspnet-sso-token-generator-20160919061823")
                .Build();

            var now = DateTimeOffset.Now.AddYears(1);
            var token = $"{now.ToUnixTimeSeconds()};83;Lemaitre";
            var tokenBytes = Encoding.UTF8.GetBytes(token);

            byte[] encryptedToken;
            byte[] iv;

            using (var aes = Aes.Create())
            {
                aes.Mode = CipherMode.CBC;
                aes.Padding = PaddingMode.Zeros;
                aes.Key = Utilities.HexToBytes(configuration.GetValue<string>("SsoKey"));
                aes.GenerateIV();
                iv = aes.IV;

                using (var ms = new MemoryStream())
                {
                    using (var cs = new CryptoStream(ms, aes.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(tokenBytes, 0, tokenBytes.Length);
                    }
                    encryptedToken = ms.ToArray();
                }

            }

            var ssoToken = Convert.ToBase64String(iv.Concat(encryptedToken).ToArray());
            File.WriteAllText(@"C:\temp\ssoToken.txt", ssoToken);
        }
    }
}
