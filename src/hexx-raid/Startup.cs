using System;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using hexx_raid.Authentication;
using hexx_raid.BattleNet;
using hexx_raid.Model;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;

namespace hexx_raid
{
    public class Startup
    {
        private static readonly Regex ServerRoutes =
             new Regex(@"(^\/api|\.(?:js|css|map)$)", RegexOptions.IgnoreCase | RegexOptions.Compiled);

        public IConfigurationRoot Configuration { get; }

        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile("localsettings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables();

            if (env.IsDevelopment())
            {
                builder.AddUserSecrets();
            }

            Configuration = builder.Build();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            var raidDbConnectionString = Configuration.GetConnectionString("HexxRaidDb");
            services.AddDbContext<HexxRaidContext>(options => options.UseSqlServer(raidDbConnectionString));

            var dbConnectionString = Configuration.GetConnectionString("HexxDb");
            services.AddTransient(provider => new MySqlConnection(dbConnectionString));

            var battleNetRegion = Configuration.GetValue<string>("BattleNetRegion");
            var battleNetLocale = Configuration.GetValue<string>("BattleNetLocale");
            var battleNetApiKey = Configuration.GetValue<string>("BattleNetApiKey");
            services.AddScoped(p => new BattleNetApi(battleNetRegion, battleNetLocale, battleNetApiKey));

            services.AddMvc().AddJsonOptions(options => options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore);

            services.AddAuthorizationPolicies();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration.GetValue<string>("SigningKey")));

            var tokenProviderOptions = new TokenProviderOptions
            {
                Issuer = "hexx",
                SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256),
                SsoTokenDecoder = new SsoTokenDecoder(Configuration.GetValue<string>("SsoKey")),
                SmfPasswordHasher = new SmfPasswordHasher()
            };

            app.UseMiddleware<TokenProviderMiddleware>(Options.Create(tokenProviderOptions));

            app.Use(ClientRoutesMiddleware);

            app.UseDefaultFiles();
            app.UseStaticFiles();

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,

                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero,

                ValidateIssuer = true,
                ValidIssuer = tokenProviderOptions.Issuer,

                ValidateIssuerSigningKey = true,
                IssuerSigningKey = signingKey
            };

            app.UseJwtBearerAuthentication(new JwtBearerOptions
            {
                AutomaticAuthenticate = true,
                AutomaticChallenge = true,
                TokenValidationParameters = tokenValidationParameters
            });

            app.UseMvc();
        }

        private static async Task ClientRoutesMiddleware(HttpContext context, Func<Task> next)
        {
            if (!ServerRoutes.IsMatch(context.Request.Path))
            {
                context.Request.Path = "/";
            }

            await next();
        }
    }
}
