using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace hexx_raid.Migrations
{
    public partial class RaidStartEndTimeMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Timestamp",
                newName: "StartTime",
                table: "Raids");

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "EndTime",
                table: "Raids",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StartTime",
                newName: "Timestamp",
                table: "Raids");

            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "Raids");
        }
    }
}
