using System;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace hexx_raid.BattleNet
{
    /// <summary>
    /// Proxy for communicating with the Battle.net API.
    /// </summary>
    public class BattleNetApi : IDisposable
    {
        private readonly string _urlFormat;
        private readonly HttpClient _httpClient;

        public BattleNetApi(string region, string locale, string apiKey)
        {
            _urlFormat = $"https://{region}.api.battle.net/wow/{{0}}?locale={locale}&apikey={apiKey}";
            _httpClient = new HttpClient();
        }

        public async Task<CharacterFormat> GetCharacter(string realm, string name)
        {
            var url = $"{string.Format(_urlFormat, $"character/{realm}/{name}")}&fields=items,talents";
            var response = await _httpClient.GetAsync(url);
            var json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<CharacterFormat>(json);
        }

        public void Dispose()
        {
            _httpClient?.Dispose();
        }
    }
}
