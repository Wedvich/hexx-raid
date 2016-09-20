using Microsoft.Extensions.DependencyInjection;

namespace hexx_raid.Authentication
{
    public static class Permissions
    {
        public static class Audit
        {
            public const string View = "audit.view";
            public const string Refresh = "audit.refresh";
        }

        public static void AddAuthorizationPolicies(this IServiceCollection services)
        {
            services.AddAuthorization(options =>
            {
                options.AddPolicy(Audit.View, policy => policy.RequireClaim(ClaimTypes.Permissions, Audit.View));
                options.AddPolicy(Audit.Refresh, policy => policy.RequireClaim(ClaimTypes.Permissions, Audit.Refresh));
            });
        }
    }
}
