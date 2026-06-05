using Microsoft.EntityFrameworkCore;
using PawsHeartsApi.Models;

namespace PawsHeartsApi.Data;

public class PawsHeartsDbContext : DbContext
{
    public PawsHeartsDbContext(DbContextOptions<PawsHeartsDbContext> options) : base(options)
    {
    }

    public DbSet<Pet> Pets { get; set; }
    public DbSet<Adopter> Adopters { get; set; }
    public DbSet<Application> Applications { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Pet>().HasData(
            new Pet { Id = 1, Name = "Max",     Age = 2, Weight = 11.5m, Location = "Tirana, AL", Gender = "Male",   Type = "Dog", Status = "Available", Description = "Friendly Golden Retriever" },
            new Pet { Id = 2, Name = "Luna",    Age = 1, Weight = 4.0m,  Location = "Durres, AL", Gender = "Female", Type = "Cat", Status = "Available", Description = "Calm and affectionate" },
            new Pet { Id = 3, Name = "Charlie", Age = 3, Weight = 12.0m, Location = "Vlore, AL",  Gender = "Male",   Type = "Dog", Status = "Pending",   Description = "Playful Beagle" }
        );

        modelBuilder.Entity<Adopter>().HasData(
            new Adopter { Id = 1, Name = "Jane Doe",   Phone = "+355 69 123 4567", Email = "jane.doe@email.com",   Address = "Tirana, AL" },
            new Adopter { Id = 2, Name = "John Smith", Phone = "+355 69 234 5678", Email = "john.smith@email.com", Address = "Durres, AL" }
        );

        modelBuilder.Entity<Application>().HasData(
            new Application { Id = "APP-1", AdopterName = "Jane Doe",   PetName = "Max",  DateApplied = "2026-05-10", Status = "Pending",  Notes = "" },
            new Application { Id = "APP-2", AdopterName = "John Smith", PetName = "Luna", DateApplied = "2026-05-12", Status = "Approved", Notes = "Verified references" }
        );
    }
}
