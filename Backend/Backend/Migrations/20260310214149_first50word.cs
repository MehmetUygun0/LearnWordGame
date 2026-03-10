using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class first50word : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Words",
                columns: new[] { "Id", "EngWordName", "Picture", "TurWordName" },
                values: new object[,]
                {
                    { 1, "Apple", "apple.jpg", "Elma" },
                    { 2, "Book", "book.jpg", "Kitap" },
                    { 3, "Car", "car.jpg", "Araba" },
                    { 4, "Dog", "dog.jpg", "Köpek" },
                    { 5, "Cat", "cat.jpg", "Kedi" },
                    { 6, "House", "house.jpg", "Ev" },
                    { 7, "Water", "water.jpg", "Su" },
                    { 8, "Fire", "fire.jpg", "Ateş" },
                    { 9, "Tree", "tree.jpg", "Ağaç" },
                    { 10, "Sun", "sun.jpg", "Güneş" },
                    { 11, "Moon", "moon.jpg", "Ay" },
                    { 12, "Star", "star.jpg", "Yıldız" },
                    { 13, "Bird", "bird.jpg", "Kuş" },
                    { 14, "Fish", "fish.jpg", "Balık" },
                    { 15, "Flower", "flower.jpg", "Çiçek" },
                    { 16, "Computer", "computer.jpg", "Bilgisayar" },
                    { 17, "Phone", "phone.jpg", "Telefon" },
                    { 18, "Table", "table.jpg", "Masa" },
                    { 19, "Chair", "chair.jpg", "Sandalye" },
                    { 20, "Door", "door.jpg", "Kapı" },
                    { 21, "Window", "window.jpg", "Pencere" },
                    { 22, "Bed", "bed.jpg", "Yatak" },
                    { 23, "Lamp", "lamp.jpg", "Lamba" },
                    { 24, "Pen", "pen.jpg", "Kalem" },
                    { 25, "Pencil", "pencil.jpg", "Kurşun Kalem" },
                    { 26, "Eraser", "eraser.jpg", "Silgi" },
                    { 27, "Ruler", "ruler.jpg", "Cetvel" },
                    { 28, "Bag", "bag.jpg", "Çanta" },
                    { 29, "Shoe", "shoe.jpg", "Ayakkabı" },
                    { 30, "Sock", "sock.jpg", "Çorap" },
                    { 31, "Shirt", "shirt.jpg", "Gömlek" },
                    { 32, "Pants", "pants.jpg", "Pantolon" },
                    { 33, "Hat", "hat.jpg", "Şapka" },
                    { 34, "Glove", "glove.jpg", "Eldiven" },
                    { 35, "Scarf", "scarf.jpg", "Atkı" },
                    { 36, "Coat", "coat.jpg", "Mont" },
                    { 37, "Rain", "rain.jpg", "Yağmur" },
                    { 38, "Snow", "snow.jpg", "Kar" },
                    { 39, "Wind", "wind.jpg", "Rüzgar" },
                    { 40, "Cloud", "cloud.jpg", "Bulut" },
                    { 41, "Sky", "sky.jpg", "Gökyüzü" },
                    { 42, "Mountain", "mountain.jpg", "Dağ" },
                    { 43, "River", "river.jpg", "Nehir" },
                    { 44, "Sea", "sea.jpg", "Deniz" },
                    { 45, "Ocean", "ocean.jpg", "Okyanus" },
                    { 46, "Beach", "beach.jpg", "Plaj" },
                    { 47, "Sand", "sand.jpg", "Kum" },
                    { 48, "Rock", "rock.jpg", "Kaya" },
                    { 49, "Soil", "soil.jpg", "Toprak" },
                    { 50, "Grass", "grass.jpg", "Çimen" }
                });

            migrationBuilder.InsertData(
                table: "WordSamples",
                columns: new[] { "Id", "Samples", "WordID" },
                values: new object[] { 1, "I eat an apple every day.", 1 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "WordSamples",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 30);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 31);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 32);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 33);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 34);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 35);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 36);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 37);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 38);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 39);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 40);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 41);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 42);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 43);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 44);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 45);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 46);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 47);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 48);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 49);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 50);

            migrationBuilder.DeleteData(
                table: "Words",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
