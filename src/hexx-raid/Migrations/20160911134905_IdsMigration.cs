﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace hexx_raid.Migrations
{
    public partial class IdsMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "RaidId",
                table: "Raids",
                nullable: false,
                defaultValueSql: "newsequentialid()");

            migrationBuilder.AlterColumn<Guid>(
                name: "CharacterId",
                table: "Characters",
                nullable: false,
                defaultValueSql: "newsequentialid()");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "RaidId",
                table: "Raids",
                nullable: false);

            migrationBuilder.AlterColumn<Guid>(
                name: "CharacterId",
                table: "Characters",
                nullable: false);
        }
    }
}
