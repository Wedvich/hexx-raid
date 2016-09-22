using Microsoft.EntityFrameworkCore.Migrations;

namespace hexx_raid.Migrations
{
    public partial class UserIsRaiderMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsRaider",
                table: "Users",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "RaidSignups",
                nullable: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRaider",
                table: "Users");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "RaidSignups",
                nullable: true);
        }
    }
}
