using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using hexx_raid.Model;

namespace hexxraid.Migrations
{
    [DbContext(typeof(HexxRaidContext))]
    [Migration("20160911134905_IdsMigration")]
    partial class IdsMigration
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

                    b.HasKey("CharacterId");

                    b.ToTable("Characters");
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
        }
    }
}
