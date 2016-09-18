using System;

namespace hexx_raid.Authentication
{
    public class SsoToken
    {
        public DateTimeOffset Expiry { get; set; }
        public int Id { get; set; }
        public string Username { get; set; }
    }
}
