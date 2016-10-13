using System;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace hexx_raid.Controllers
{
    [Route("/")]
    public class HomeController : Controller
    {
        private readonly string _appInsightsInstrumentationKey;
        private readonly string _index;

        public HomeController(IHostingEnvironment env, IConfiguration configuration)
        {
            _appInsightsInstrumentationKey = configuration.GetValue<string>("APPINSIGHTS_INSTRUMENTATIONKEY");
            _index = Path.Combine(env.WebRootPath, "index.html");
        }

        public IActionResult Index()
        {
            var html = System.IO.File.ReadAllText(_index);
            if (!string.IsNullOrEmpty(_appInsightsInstrumentationKey))
            {
                const string jsBundle = "id=\"js-bundle\"";
                var jsBundleIndex = html.LastIndexOf(jsBundle, StringComparison.Ordinal) + jsBundle.Length;
                html = html.Insert(jsBundleIndex, $" data-ai-instrumentation-key=\"{_appInsightsInstrumentationKey}\"");
            }

            var buffer = new MemoryStream();
            var sw = new StreamWriter(buffer);
            sw.Write(html);
            sw.Flush();
            buffer.Seek(0, SeekOrigin.Begin);

            return File(buffer, "text/html");
        }
    }
}
