using System.Collections.Generic;

namespace hexx_raid.BattleNet
{
    public class ItemsFormat
    {
        public int AverageItemLevel { get; set; }
        public int AverageItemLevelEquipped { get; set; }
        public ItemFormat Head { get; set; }
        public ItemFormat Back { get; set; }
        public ItemFormat Neck { get; set; }
        public ItemFormat Shoulder { get; set; }
        public ItemFormat Chest { get; set; }
        public ItemFormat Wrist { get; set; }
        public ItemFormat Hands { get; set; }
        public ItemFormat Waist { get; set; }
        public ItemFormat Legs { get; set; }
        public ItemFormat Feet { get; set; }
        public ItemFormat Finger1 { get; set; }
        public ItemFormat Finger2 { get; set; }
        public ItemFormat Trinket1 { get; set; }
        public ItemFormat Trinket2 { get; set; }
        public ItemFormat MainHand { get; set; }

        public IEnumerable<ItemFormat> GetSocketableItems()
        {
            yield return Head;
            yield return Back;
            yield return Neck;
            yield return Shoulder;
            yield return Chest;
            yield return Wrist;
            yield return Hands;
            yield return Waist;
            yield return Legs;
            yield return Feet;
            yield return Finger1;
            yield return Finger2;
            yield return Trinket1;
            yield return Trinket2;
        }
    }
}
