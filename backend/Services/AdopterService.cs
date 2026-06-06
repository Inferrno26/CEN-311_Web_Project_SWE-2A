using Microsoft.EntityFrameworkCore;
using PawsHeartsApi.Data;
using PawsHeartsApi.Models;

namespace PawsHeartsApi.Services;

public class AdopterService
{
    private readonly PawsHeartsDbContext _db;

    public AdopterService(PawsHeartsDbContext db)
    {
        _db = db;
    }

    public async Task<List<Adopter>> GetAllAsync()
    {
        return await _db.Adopters.ToListAsync();
    }

    public async Task<Adopter?> GetByIdAsync(int id)
    {
        return await _db.Adopters.FindAsync(id);
    }

    public async Task<Adopter> CreateAsync(Adopter adopter)
    {
        _db.Adopters.Add(adopter);
        await _db.SaveChangesAsync();
        return adopter;
    }

    public async Task<Adopter?> UpdateAsync(int id, Adopter adopter)
    {
        var existing = await _db.Adopters.FindAsync(id);
        if (existing == null)
        {
            return null;
        }

        existing.Name    = adopter.Name;
        existing.Phone   = adopter.Phone;
        existing.Email   = adopter.Email;
        existing.Address = adopter.Address;

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var adopter = await _db.Adopters.FindAsync(id);
        if (adopter == null)
        {
            return false;
        }

        _db.Adopters.Remove(adopter);
        await _db.SaveChangesAsync();
        return true;
    }
}
