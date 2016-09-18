using System;

namespace hexx_raid.Model
{
    public class Note
    {
        public Guid NoteId { get; set; }
        public int CreatingUserId { get; set; }
        public string Text { get; set; }
        public DateTimeOffset Timestamp { get; set; }
    }
}
