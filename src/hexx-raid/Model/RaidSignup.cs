using System;

namespace hexx_raid.Model
{
    public enum RaidSignupStatus
    {
        Coming,
        Maybe,
        NotComing
    }

    public class RaidSignup
    {
        public Guid RaidSignupId { get; set; }
        public DateTimeOffset Timestamp { get; set; }
        public Character Character { get; set; }
        public Note Note { get; set; }
        public RaidSignupStatus Status { get; set; }
    }
}
