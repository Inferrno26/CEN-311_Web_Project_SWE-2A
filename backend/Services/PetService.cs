using Microsoft.EntityFrameworkCore;
using PawsHeartsApi.Data;
using PawsHeartsApi.Models;

namespace PawsHeartsApi.Services;

public class PetService
{
    private readonly PawsHeartsDbContext _db;

    public PetService(PawsHeartsDbContext db)
    {
        _db = db;
    }

    public async Task<List<Pet>> GetAllAsync()
    {
        return await _db.Pets.ToListAsync();
    }

    public async Task<Pet?> GetByIdAsync(int id)
    {
        return await _db.Pets.FindAsync(id);
    }

    public async Task<Pet> CreateAsync(Pet pet)
    {
        _db.Pets.Add(pet);
        await _db.SaveChangesAsync();
        return pet;
    }

    public async Task<Pet?> UpdateAsync(int id, Pet pet)
    {
        var existing = await _db.Pets.FindAsync(id);
        if (existing == null)
        {
            return null;
        }

        existing.Name        = pet.Name;
        existing.Age         = pet.Age;
        existing.Weight      = pet.Weight;
        existing.Location    = pet.Location;
        existing.Gender      = pet.Gender;
        existing.Type        = pet.Type;
        existing.Status      = pet.Status;
        existing.Description = pet.Description;

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var pet = await _db.Pets.FindAsync(id);
        if (pet == null)
        {
            return false;
        }

        _db.Pets.Remove(pet);
        await _db.SaveChangesAsync();
        return true;
    }
}
