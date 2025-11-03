using LabAdmin.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LabAdmin.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Lab> Labs { get; set; }
        public DbSet<Device> Devices { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<SoftwareRequest> SoftwareRequests { get; set; }
        public DbSet<WorkLog> WorkLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Define the complex relationships to the User table
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Requester)
                .WithMany()
                .HasForeignKey(t => t.RequestedBy)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Technician)
                .WithMany()
                .HasForeignKey(t => t.AssignedTo)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}