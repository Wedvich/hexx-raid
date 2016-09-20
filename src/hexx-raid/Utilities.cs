using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;

namespace hexx_raid
{
    public static class Utilities
    {
        public static byte[] HexToBytes(string hexString)
        {
            return Enumerable.Range(0, hexString.Length / 2)
                .Select(x => Convert.ToByte(hexString.Substring(x * 2, 2), 16))
                .ToArray();
        }

        public static string BytesToHex(byte[] bytes)
        {
            return string.Join(string.Empty, bytes.Select(b => b.ToString("x2")));
        }

        public static int GetUserId(this ClaimsPrincipal principal)
        {
            var userIdClaim = principal.Claims.FirstOrDefault(claim => claim.Properties.Any(p => p.Value == JwtRegisteredClaimNames.Sub));
            int userId;
            if (!int.TryParse(userIdClaim?.Value, out userId))
                throw new ArgumentException("Principal does not contain a user ID claim", nameof(principal));
            return userId;
        }
    }
}
