using System;
using System.Collections.Generic;

namespace hexx_raid.Model
{
    public class User
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public bool IsManagement { get; set; }
        public bool IsRaider { get; set; }
        public List<Note> Notes { get; set; } = new List<Note>();
        public List<Character> Characters { get; set; } = new List<Character>();
    }
}
