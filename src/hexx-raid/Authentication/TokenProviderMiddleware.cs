using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using hexx_raid.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using MySql.Data.MySqlClient;
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
            User user = null;
            var now = DateTimeOffset.Now;

            var ssoToken = context.Request.Form["sso_token"];
            if (!string.IsNullOrEmpty(ssoToken))
            {
                user = await GenerateTokenFromSso(context, now, ssoToken);
            }
            else
            {
                var username = context.Request.Form["username"];
                var password = context.Request.Form["password"];

                if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(password))
                {
                    user = await GenerateTokenFromUsernamePassword(context, username, password);
                }
            }

            if (user == null)
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("Bad request.");
                return;
            }

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, now.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64),

                new Claim(ClaimTypes.Permissions, Permissions.Raids.View)
            };

            if (user.IsRaider)
            {
                claims.AddRange(new[] {
                    new Claim(ClaimTypes.Permissions, Permissions.Raids.Signup)
                });
            }

            if (user.IsManagement)
            {
                claims.AddRange(new [] {
                    new Claim(ClaimTypes.Permissions, Permissions.Raids.Manage),
                    new Claim(ClaimTypes.Permissions, Permissions.Audit.View),
                    new Claim(ClaimTypes.Permissions, Permissions.Audit.Refresh)
                });
            }

            var jwt = new JwtSecurityToken(
                issuer: _options.Issuer,
                claims: claims,
                notBefore: now.DateTime,
                expires: now.Add(_options.Expiration).DateTime,
                signingCredentials: _options.SigningCredentials);

            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            var response = new AuthTokenResponse
            {
                AccessToken = encodedJwt,
                ExpiresIn = (int) _options.Expiration.TotalSeconds
            };

            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonConvert.SerializeObject(response, AuthTokenResponse.SerializerSettings));
        }

        private async Task<User> GenerateTokenFromSso(HttpContext context, DateTimeOffset now, string ssoToken)
        {
            var decodedSsoToken = _options.SsoTokenDecoder.Decode(ssoToken);
            if (decodedSsoToken.Expiry < now)
            {
                return null;
            }

            var dbContext = context.RequestServices.GetService<HexxRaidContext>();
            return await dbContext.Users.FirstOrDefaultAsync(u => u.UserId == decodedSsoToken.Id);
        }

        private async Task<User> GenerateTokenFromUsernamePassword(HttpContext context, string username, string password)
        {
            var dbConnection = context.RequestServices.GetService<MySqlConnection>();
            try
            {
                await dbConnection.OpenAsync();
                var command = dbConnection.CreateCommand();
                command.CommandText = "SELECT ID_MEMBER, passwd FROM smf_members WHERE memberName=@Username";
                command.Parameters.AddWithValue("@Username", username);
                var reader = command.ExecuteReader();
                await reader.ReadAsync();
                if (!reader.HasRows)
                {
                    reader.Close();
                    return null;
                }
                var userId = reader["ID_MEMBER"];
                var passwordHash = reader["passwd"] as string;
                reader.Close();

                var providedPasswordHash = _options.SmfPasswordHasher.Hash(username, password);
                if (passwordHash != providedPasswordHash)
                {
                    return null;
                }

                var parsedUserId = Convert.ToInt32(userId);

                var dbContext = context.RequestServices.GetService<HexxRaidContext>();
                return await dbContext.Users.FirstOrDefaultAsync(u => u.UserId == parsedUserId);
            }
            finally
            {
                await dbConnection.CloseAsync();
            }
        }
    }
}

