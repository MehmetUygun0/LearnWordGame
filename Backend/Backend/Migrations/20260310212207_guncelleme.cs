using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class guncelleme : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "WordSamplesID",
                table: "WordSamples",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "WordID",
                table: "Words",
                newName: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "WordSamples",
                newName: "WordSamplesID");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Words",
                newName: "WordID");
        }
    }
}
