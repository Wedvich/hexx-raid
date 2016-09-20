using System;

namespace hexx_raid.Model
{
    public class CharacterAudit
    {
        public Guid CharacterAuditId { get; set; }
        public Guid CharacterId { get; set; }
        public DateTimeOffset LastUpdated { get; set; }
        public float ItemLevel { get; set; }
        public bool IsInPrimarySpec { get; set; }
    }
}
