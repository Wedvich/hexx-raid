using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace hexx_raid.Migrations
{
    public partial class CharacterAuditMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CharacterAudits",
                columns: table => new
                {
                    CharacterAuditId = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    CharacterId = table.Column<Guid>(nullable: false),
                    ItemLevel = table.Column<float>(nullable: false),
                    LastUpdated = table.Column<DateTimeOffset>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CharacterAudits", x => x.CharacterAuditId);
                    table.ForeignKey(
                        name: "FK_CharacterAudits_Characters_CharacterId",
                        column: x => x.CharacterId,
                        principalTable: "Characters",
                        principalColumn: "CharacterId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CharacterAudits_CharacterId",
                table: "CharacterAudits",
                column: "CharacterId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CharacterAudits");
        }
    }
}
