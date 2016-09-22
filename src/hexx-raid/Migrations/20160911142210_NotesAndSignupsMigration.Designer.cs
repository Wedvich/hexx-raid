using System;
using hexx_raid.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace hexx_raid.Migrations
{
    [DbContext(typeof(HexxRaidContext))]
    [Migration("20160911142210_NotesAndSignupsMigration")]
    partial class NotesAndSignupsMigration
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.0.0-rtm-21431")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("hexx_raid.Model.Character", b =>
                {
                    b.Property<Guid>("CharacterId")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<int>("Class");

                    b.Property<string>("Name");

                    b.Property<string>("OffSpecs");

                    b.Property<string>("PrimarySpec");

                    b.Property<int>("UserId");

                    b.HasKey("CharacterId");

                    b.ToTable("Characters");
                });

            modelBuilder.Entity("hexx_raid.Model.Note", b =>
                {
                    b.Property<Guid>("NoteId")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<Guid?>("RaidId");

                    b.Property<string>("Text");

                    b.Property<int>("UserId");

                    b.HasKey("NoteId");

                    b.HasIndex("RaidId");

                    b.ToTable("Notes");
                });

            modelBuilder.Entity("hexx_raid.Model.Raid", b =>
                {
                    b.Property<Guid>("RaidId")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<int>("RaidZone");

                    b.Property<DateTimeOffset>("Timestamp");

                    b.HasKey("RaidId");

                    b.ToTable("Raids");
                });

            modelBuilder.Entity("hexx_raid.Model.RaidSignup", b =>
                {
                    b.Property<Guid>("RaidSignupId")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<Guid?>("CharacterId");

                    b.Property<Guid?>("NoteId");

                    b.Property<Guid?>("RaidId");

                    b.Property<DateTimeOffset>("Timestamp");

                    b.HasKey("RaidSignupId");

                    b.HasIndex("CharacterId");

                    b.HasIndex("NoteId");

                    b.HasIndex("RaidId");

                    b.ToTable("RaidSignups");
                });

            modelBuilder.Entity("hexx_raid.Model.Note", b =>
                {
                    b.HasOne("hexx_raid.Model.Raid")
                        .WithMany("Notes")
                        .HasForeignKey("RaidId");
                });

            modelBuilder.Entity("hexx_raid.Model.RaidSignup", b =>
                {
                    b.HasOne("hexx_raid.Model.Character", "Character")
                        .WithMany()
                        .HasForeignKey("CharacterId");

                    b.HasOne("hexx_raid.Model.Note", "Note")
                        .WithMany()
                        .HasForeignKey("NoteId");

                    b.HasOne("hexx_raid.Model.Raid")
                        .WithMany("Signups")
                        .HasForeignKey("RaidId");
                });
        }
    }
}
