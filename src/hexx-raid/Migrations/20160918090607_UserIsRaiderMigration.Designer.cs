using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using hexx_raid.Model;

namespace hexxraid.Migrations
{
    [DbContext(typeof(HexxRaidContext))]
    [Migration("20160918090607_UserIsRaiderMigration")]
    partial class UserIsRaiderMigration
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

                    b.Property<bool>("IsMain");

                    b.Property<string>("Name");

                    b.Property<string>("OffSpecs");

                    b.Property<string>("PrimarySpec");

                    b.Property<int>("UserId");

                    b.HasKey("CharacterId");

                    b.HasIndex("UserId");

                    b.ToTable("Characters");
                });

            modelBuilder.Entity("hexx_raid.Model.Note", b =>
                {
                    b.Property<Guid>("NoteId")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<int>("CreatingUserId");

                    b.Property<Guid?>("RaidId");

                    b.Property<string>("Text");

                    b.Property<DateTimeOffset>("Timestamp");

                    b.Property<int?>("UserId");

                    b.HasKey("NoteId");

                    b.HasIndex("RaidId");

                    b.HasIndex("UserId");

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

                    b.Property<int>("Status");

                    b.Property<DateTimeOffset>("Timestamp");

                    b.HasKey("RaidSignupId");

                    b.HasIndex("CharacterId");

                    b.HasIndex("NoteId");

                    b.HasIndex("RaidId");

                    b.ToTable("RaidSignups");
                });

            modelBuilder.Entity("hexx_raid.Model.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("IsManagement");

                    b.Property<bool>("IsRaider");

                    b.Property<string>("Name");

                    b.HasKey("UserId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("hexx_raid.Model.Character", b =>
                {
                    b.HasOne("hexx_raid.Model.User")
                        .WithMany("Characters")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("hexx_raid.Model.Note", b =>
                {
                    b.HasOne("hexx_raid.Model.Raid")
                        .WithMany("Notes")
                        .HasForeignKey("RaidId");

                    b.HasOne("hexx_raid.Model.User")
                        .WithMany("Notes")
                        .HasForeignKey("UserId");
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
