using LabAdmin.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LabAdmin.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // Register all your models as DbSets
        // This tells EF Core that these models correspond to tables
        public DbSet<User> Users { get; set; }
        public DbSet<Lab> Labs { get; set; }
        public DbSet<Device> Devices { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<SoftwareRequest> SoftwareRequests { get; set; }
        public DbSet<WorkLog> WorkLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // We need to manually define the relationships for the Ticket table
            // because it has multiple foreign keys to the User table.

            // Define the 'RequestedBy' relationship
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Requester)
                .WithMany() // A User can have many requested tickets, but we don't need to define the collection on User
                .HasForeignKey(t => t.RequestedBy)
                .OnDelete(DeleteBehavior.Restrict); // Don't delete a user if they have tickets

            // Define the 'AssignedTo' relationship
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Technician)
                .WithMany() // A User can have many assigned tickets
                .HasForeignKey(t => t.AssignedTo)
                .OnDelete(DeleteBehavior.SetNull); // If a tech is deleted, set AssignedTo to null, not delete the ticket
        }
    }
}
