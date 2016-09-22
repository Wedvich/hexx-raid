using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace hexx_raid.Migrations
{
    public partial class UserMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Notes");

            migrationBuilder.AddColumn<int>(
                name: "CreatingUserId",
                table: "Notes",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "Timestamp",
                table: "Notes",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatingUserId",
                table: "Notes");

            migrationBuilder.DropColumn(
                name: "Timestamp",
                table: "Notes");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Notes",
                nullable: false,
                defaultValue: 0);
        }
    }
}
