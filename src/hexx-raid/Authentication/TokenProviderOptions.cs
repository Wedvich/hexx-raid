using System;
using Microsoft.IdentityModel.Tokens;

namespace hexx_raid.Authentication
{
    public class TokenProviderOptions
    {
        public string Path { get; set; } = "/token";
        public string Issuer { get; set; }
        public TimeSpan Expiration { get; set; } = TimeSpan.FromMinutes(30);
        public SigningCredentials SigningCredentials { get; set; }
        public SsoTokenDecoder SsoTokenDecoder { get; set; }
        public SmfPasswordHasher SmfPasswordHasher { get; set; }
    }
}
