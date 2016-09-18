using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using hexx_raid.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace hexx_raid.Authentication
{
    public class TokenProviderMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly TokenProviderOptions _options;

        public TokenProviderMiddleware(RequestDelegate next, IOptions<TokenProviderOptions> options)
        {
            _next = next;
            _options = options.Value;
        }

        public Task Invoke(HttpContext context)
        {
            if (!context.Request.Path.Equals(_options.Path, StringComparison.Ordinal))
            {
                return _next(context);
            }
            
            if (context.Request.Method.Equals("POST") && context.Request.HasFormContentType)
            { 
                return GenerateToken(context);
            }

            context.Response.StatusCode = 400;
            return context.Response.WriteAsync("Bad request.");
        }

        private async Task GenerateToken(HttpContext context)
        {
            var ssoToken = context.Request.Form["sso_token"];
            if (string.IsNullOrEmpty(ssoToken))
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("Bad request.");
                return;
            }

            var decodedSsoToken = _options.SsoTokenDecoder.Decode(ssoToken);
            var now = DateTimeOffset.Now;
            if (decodedSsoToken.Expiry < now)
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("SSO token expired.");
                return;
            }

            var dbContext = context.RequestServices.GetService<HexxRaidContext>();
            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.UserId == decodedSsoToken.Id);
            if (user == null)
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("Invalid SSO token.");
                return;
            }

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, now.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
            };

            var jwt = new JwtSecurityToken(
                issuer: _options.Issuer,
                claims: claims,
                notBefore: now.DateTime,
                expires: now.Add(_options.Expiration).DateTime,
                signingCredentials: _options.SigningCredentials);

            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            var response = new
            {
                access_token = encodedJwt,
                expires_in = (int) _options.Expiration.TotalSeconds
            };

            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonConvert.SerializeObject(response, new JsonSerializerSettings { Formatting = Formatting.Indented }));
        }
    }
}
