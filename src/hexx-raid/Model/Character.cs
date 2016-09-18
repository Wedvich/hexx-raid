using System;

namespace hexx_raid.Model
{
    public enum CharacterClass
    {
        DeathKnight = 6,
        DemonHunter = 12,
        Druid = 11,
        Hunter = 3,
        Mage = 8,
        Monk = 10,
        Paladin = 2,
        Priest = 5,
        Rogue = 4,
        Shaman = 7,
        Warlock = 9,
        Warrior = 1
    }

    public class Character
    {
        public Guid CharacterId { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; }
        public CharacterClass Class { get; set; }
        public string PrimarySpec { get; set; }
        public string OffSpecs { get; set; }
        public bool IsMain { get; set; }
    }
}
