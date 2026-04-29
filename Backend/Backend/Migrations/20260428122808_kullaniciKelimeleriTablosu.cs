using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class kullaniciKelimeleriTablosu : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WordSamples_Words_WordID",
                table: "WordSamples");

            migrationBuilder.DropPrimaryKey(
                name: "PK_WordSamples",
                table: "WordSamples");

            migrationBuilder.RenameTable(
                name: "WordSamples",
                newName: "WordSample");

            migrationBuilder.RenameIndex(
                name: "IX_WordSamples_WordID",
                table: "WordSample",
                newName: "IX_WordSample_WordID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_WordSample",
                table: "WordSample",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "UserWords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    EngWordName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TurWordName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Picture = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Level = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserWords", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserWordSamples",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserWordId = table.Column<int>(type: "int", nullable: false),
                    Sample = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserWordSamples", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserWordSamples_UserWords_UserWordId",
                        column: x => x.UserWordId,
                        principalTable: "UserWords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserWordSamples_UserWordId",
                table: "UserWordSamples",
                column: "UserWordId");

            migrationBuilder.AddForeignKey(
                name: "FK_WordSample_Words_WordID",
                table: "WordSample",
                column: "WordID",
                principalTable: "Words",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WordSample_Words_WordID",
                table: "WordSample");

            migrationBuilder.DropTable(
                name: "UserWordSamples");

            migrationBuilder.DropTable(
                name: "UserWords");

            migrationBuilder.DropPrimaryKey(
                name: "PK_WordSample",
                table: "WordSample");

            migrationBuilder.RenameTable(
                name: "WordSample",
                newName: "WordSamples");

            migrationBuilder.RenameIndex(
                name: "IX_WordSample_WordID",
                table: "WordSamples",
                newName: "IX_WordSamples_WordID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_WordSamples",
                table: "WordSamples",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_WordSamples_Words_WordID",
                table: "WordSamples",
                column: "WordID",
                principalTable: "Words",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
