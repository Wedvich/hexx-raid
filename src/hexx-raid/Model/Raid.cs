using System;
using System.Collections.Generic;

namespace hexx_raid.Model
{
    public enum RaidZone
    {
        Nighthold = 8025,
        EmeraldNightmare = 8026
    }

    public class Raid
    {
        public Guid RaidId { get; set; }
        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset EndTime { get; set; }
        public RaidZone RaidZone { get; set; }
        public List<Note> Notes { get; set; } = new List<Note>();
        public List<RaidSignup> Signups { get; set; } = new List<RaidSignup>();
        public string Plan { get; set; }
    }
}
