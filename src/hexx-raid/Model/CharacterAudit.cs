using System;
using System.Collections.Generic;
using System.Linq;

namespace hexx_raid.Model
{
    public enum EnhancementQuality
    {
        None,
        Poor,
        Good
    }

    public class CharacterAudit
    {
        public Guid CharacterAuditId { get; set; }
        public Guid CharacterId { get; set; }
        public DateTimeOffset LastRefreshed { get; set; }
        public float ItemLevel { get; set; }
        public bool IsInPrimarySpec { get; set; }
        public EnhancementQuality NeckEnchant { get; set; }
        public EnhancementQuality CloakEnchant { get; set; }
        public EnhancementQuality Ring1Enchant { get; set; }
        public EnhancementQuality Ring2Enchant { get; set; }
        public string Gems { get; set; }

        public IEnumerable<EnhancementQuality> GetGems()
        {
            return Gems?.Split(',').Select(g => (EnhancementQuality)int.Parse(g)) ?? Enumerable.Empty<EnhancementQuality>().OrderByDescending(g => g);
        }

        public void SetGems(IEnumerable<EnhancementQuality> gems)
        {
            Gems = string.Join(",", gems.Select(g => ((int) g).ToString()));
        }

        public static EnhancementQuality GetEnhancementQuality(int? enhancementId)
        {
            switch (enhancementId)
            {
                case 5427:
                case 5428:
                case 5429:
                case 5430:
                case 5434:
                case 5435:
                case 5436:
                case 5437:
                case 5438:
                case 5439:
                case 5890:
                case 5891:
                case 130219:
                case 130220:
                case 130221:
                case 130222:
                case 130246:
                case 130247:
                case 130248:
                     return EnhancementQuality.Good;

                case 5423:
                case 5424:
                case 5425:
                case 5426:
                case 5431:
                case 5432:
                case 5433:
                case 130215:
                case 130216:
                case 130217:
                case 130218:
                    return EnhancementQuality.Poor;

                case null:
                    return EnhancementQuality.None;

                default:
                    return EnhancementQuality.None;
            }
        }
    }
}
