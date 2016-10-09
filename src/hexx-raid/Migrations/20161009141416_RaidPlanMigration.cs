using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace hexx_raid.Migrations
{
    public partial class RaidPlanMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Plan",
                table: "Raids",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Plan",
                table: "Raids");
        }
    }
}
