using Newtonsoft.Json;

namespace hexx_raid.Authentication
{
    public class AuthTokenRequest
    {
        [JsonProperty("grant_type")]
        public string GrantType { get; set; }

        [JsonProperty("username")]
        public string Username { get; set; }

        [JsonProperty("password")]
        public string Password { get; set; }

        [JsonProperty("code")]
        public string Code { get; set; }
    }
}
