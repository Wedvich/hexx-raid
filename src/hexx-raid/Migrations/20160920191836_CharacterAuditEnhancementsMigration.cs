using hexx_raid.Model;
using Microsoft.EntityFrameworkCore.Migrations;

namespace hexx_raid.Migrations
{
    public partial class CharacterAuditEnhancementsMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CloakEnchant",
                table: "CharacterAudits",
                nullable: false,
                defaultValue: EnhancementQuality.None);

            migrationBuilder.AddColumn<string>(
                name: "Gems",
                table: "CharacterAudits",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NeckEnchant",
                table: "CharacterAudits",
                nullable: false,
                defaultValue: EnhancementQuality.None);

            migrationBuilder.AddColumn<int>(
                name: "Ring1Enchant",
                table: "CharacterAudits",
                nullable: false,
                defaultValue: EnhancementQuality.None);

            migrationBuilder.AddColumn<int>(
                name: "Ring2Enchant",
                table: "CharacterAudits",
                nullable: false,
                defaultValue: EnhancementQuality.None);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CloakEnchant",
                table: "CharacterAudits");

            migrationBuilder.DropColumn(
                name: "Gems",
                table: "CharacterAudits");

            migrationBuilder.DropColumn(
                name: "NeckEnchant",
                table: "CharacterAudits");

            migrationBuilder.DropColumn(
                name: "Ring1Enchant",
                table: "CharacterAudits");

            migrationBuilder.DropColumn(
                name: "Ring2Enchant",
                table: "CharacterAudits");
        }
    }
}
