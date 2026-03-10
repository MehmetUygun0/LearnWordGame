using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>()
                .Property(u => u.UserName)
                .UseCollation("Turkish_CS_AS");
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Word> Words { get; set; }
        public DbSet<WordSample> WordSamples { get; set; }

    }
}
