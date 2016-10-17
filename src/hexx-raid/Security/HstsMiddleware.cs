using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace hexx_raid.Security
{
    public class HstsMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly HstsOptions _options;

        public HstsMiddleware(RequestDelegate next, IOptions<HstsOptions> options)
        {
            _next = next;
            _options = options.Value;
        }

        public async Task Invoke(HttpContext context)
        {
            if (context.Request.IsHttps)
            {
                var hstsHeader = new StringBuilder($"max-age={_options.MaxAge}");
                if (_options.IncludeSubdomains)
                {
                    hstsHeader.Append("; includeSubDomains");
                }
                if (_options.Preload)
                {
                    hstsHeader.Append("; preload");
                }

                context.Response.OnStarting(() =>
                {
                    context.Response.Headers.Add("Strict-Transport-Security", hstsHeader.ToString());
                    return Task.FromResult(0);
                });

                await _next(context);
            }
            else
            {
                context.Response.Redirect($"https://{context.Request.Host}{context.Request.Path}{context.Request.QueryString}", true);
            }
        }
    }
}
