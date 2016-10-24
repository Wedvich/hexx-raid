using System;
using System.Diagnostics;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using hexx_raid.Authentication;
using hexx_raid.BattleNet;
using hexx_raid.Model;
using hexx_raid.Security;
using Microsoft.ApplicationInsights;
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
using Serilog;

namespace hexx_raid
{
    public class Startup
    {
        private static readonly Regex ServerRoutes =
            new Regex(@"(^\/api|\.(?:js|css|map)$)", RegexOptions.IgnoreCase | RegexOptions.Compiled);

        public IConfigurationRoot Configuration { get; }

        private readonly TelemetryClient _telemetryClient;

        private readonly Stopwatch _startupTimer;

        public Startup(IHostingEnvironment env)
        {
            _startupTimer = new Stopwatch();
            _startupTimer.Start();

            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile("localsettings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables();

            if (env.IsDevelopment())
            {
                builder.AddUserSecrets();
                builder.AddApplicationInsightsSettings(developerMode: true);
            }

            Configuration = builder.Build();

            _telemetryClient = new TelemetryClient
            {
                InstrumentationKey = Configuration.GetValue<string>("AppInsights:InstrumentationKey")
            };

            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Verbose()
                .Enrich.FromLogContext()
                .WriteTo.ApplicationInsightsTraces(_telemetryClient)
                .CreateLogger();

            Log.Information("App is starting up.");
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IConfiguration>(Configuration);

            services.AddApplicationInsightsTelemetry(Configuration);

            // Override the TelemetryClient added above, to ensure that it gets properly flushed to the log sink.
            services.AddSingleton(_telemetryClient);

            var raidDbConnectionString = Configuration.GetConnectionString("HexxRaidDb");
            services.AddDbContext<HexxRaidContext>(options => options.UseSqlServer(raidDbConnectionString));

            var dbConnectionString = Configuration.GetConnectionString("HexxDb");
            services.AddTransient(provider => new MySqlConnection(dbConnectionString));

            var battleNetRegion = Configuration.GetValue<string>("BattleNet:Region");
            var battleNetLocale = Configuration.GetValue<string>("BattleNet:Locale");
            var battleNetApiKey = Configuration.GetValue<string>("BattleNet:ApiKey");
            services.AddScoped(p => new BattleNetApi(battleNetRegion, battleNetLocale, battleNetApiKey));

            services.AddMvc()
                .AddJsonOptions(options => options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore);

            services.AddAuthorizationPolicies();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, IApplicationLifetime appLifetime)
        {
            loggerFactory.AddSerilog();
            appLifetime.ApplicationStopped.Register(_telemetryClient.Flush);
            appLifetime.ApplicationStopped.Register(Log.CloseAndFlush);

            app.UseApplicationInsightsRequestTelemetry();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseApplicationInsightsExceptionTelemetry();

            if (Configuration.GetSection("Hsts")?.Value != null)
            {
                var hstsOptions = new HstsOptions
                {
                    MaxAge = Math.Max(0, Configuration.GetValue<int>("Hsts:MaxAge")),
                    IncludeSubdomains = Configuration.GetValue<bool>("Hsts:IncludeSubdomains"),
                    Preload = Configuration.GetValue<bool>("Hsts:Preload")
                };

                app.UseMiddleware<HstsMiddleware>(Options.Create(hstsOptions));
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

            _startupTimer.Stop();
            Log.Information("App startup completed ({StartupTime}ms).", _startupTimer.ElapsedMilliseconds);
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
