using Microsoft.EntityFrameworkCore;

namespace hexx_raid.Model
{
    public class HexxRaidContext : DbContext
    {
        public HexxRaidContext(DbContextOptions<HexxRaidContext> options)
            : base(options)
        { }

        public DbSet<Raid> Raids { get; set; }
        public DbSet<Character> Characters { get; set; }
        public DbSet<Note> Notes { get; set; }
        public DbSet<RaidSignup> RaidSignups { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Raid>(b =>
            {
                b.Property(r => r.RaidId).HasDefaultValueSql("newsequentialid()");
            });

            modelBuilder.Entity<Character>(b =>
            {
                b.Property(r => r.CharacterId).HasDefaultValueSql("newsequentialid()");
            });

            modelBuilder.Entity<Note>(b =>
            {
                b.Property(r => r.NoteId).HasDefaultValueSql("newsequentialid()");
            });

            modelBuilder.Entity<RaidSignup>(b =>
            {
                b.Property(r => r.RaidSignupId).HasDefaultValueSql("newsequentialid()");
            });
        }
    }
}
