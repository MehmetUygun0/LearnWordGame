using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class update1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Picture",
                table: "UserWords");

            migrationBuilder.RenameColumn(
                name: "WordCount",
                table: "UserProgressSettings",
                newName: "SkipCount");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SkipCount",
                table: "UserProgressSettings",
                newName: "WordCount");

            migrationBuilder.AddColumn<string>(
                name: "Picture",
                table: "UserWords",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
