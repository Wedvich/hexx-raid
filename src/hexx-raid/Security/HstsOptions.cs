namespace hexx_raid.Security
{
    public class HstsOptions
    {
        public int MaxAge { get; set; }
        public bool IncludeSubdomains { get; set; }
        public bool Preload { get; set; }
    }
}
