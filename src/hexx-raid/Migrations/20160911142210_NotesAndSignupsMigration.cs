using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace hexx_raid.Migrations
{
    public partial class NotesAndSignupsMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Notes",
                columns: table => new
                {
                    NoteId = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    RaidId = table.Column<Guid>(nullable: true),
                    Text = table.Column<string>(nullable: true),
                    UserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notes", x => x.NoteId);
                    table.ForeignKey(
                        name: "FK_Notes_Raids_RaidId",
                        column: x => x.RaidId,
                        principalTable: "Raids",
                        principalColumn: "RaidId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RaidSignups",
                columns: table => new
                {
                    RaidSignupId = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    CharacterId = table.Column<Guid>(nullable: true),
                    NoteId = table.Column<Guid>(nullable: true),
                    RaidId = table.Column<Guid>(nullable: true),
                    Timestamp = table.Column<DateTimeOffset>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RaidSignups", x => x.RaidSignupId);
                    table.ForeignKey(
                        name: "FK_RaidSignups_Characters_CharacterId",
                        column: x => x.CharacterId,
                        principalTable: "Characters",
                        principalColumn: "CharacterId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RaidSignups_Notes_NoteId",
                        column: x => x.NoteId,
                        principalTable: "Notes",
                        principalColumn: "NoteId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RaidSignups_Raids_RaidId",
                        column: x => x.RaidId,
                        principalTable: "Raids",
                        principalColumn: "RaidId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Characters",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Notes_RaidId",
                table: "Notes",
                column: "RaidId");

            migrationBuilder.CreateIndex(
                name: "IX_RaidSignups_CharacterId",
                table: "RaidSignups",
                column: "CharacterId");

            migrationBuilder.CreateIndex(
                name: "IX_RaidSignups_NoteId",
                table: "RaidSignups",
                column: "NoteId");

            migrationBuilder.CreateIndex(
                name: "IX_RaidSignups_RaidId",
                table: "RaidSignups",
                column: "RaidId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Characters");

            migrationBuilder.DropTable(
                name: "RaidSignups");

            migrationBuilder.DropTable(
                name: "Notes");
        }
    }
}
