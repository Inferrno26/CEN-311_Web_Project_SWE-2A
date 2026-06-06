using Microsoft.EntityFrameworkCore;
using PawsHeartsApi.Data;
using PawsHeartsApi.Models;

namespace PawsHeartsApi.Services;

public class ApplicationService
{
    private readonly PawsHeartsDbContext _db;

    public ApplicationService(PawsHeartsDbContext db)
    {
        _db = db;
    }

    public async Task<List<Application>> GetAllAsync()
    {
        return await _db.Applications.ToListAsync();
    }

    public async Task<Application?> GetByIdAsync(string id)
    {
        return await _db.Applications.FindAsync(id);
    }

    public async Task<Application> CreateAsync(Application application)
    {
        application.Id = "APP-" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        _db.Applications.Add(application);
        await _db.SaveChangesAsync();
        return application;
    }

    public async Task<Application?> UpdateAsync(string id, Application application)
    {
        var existing = await _db.Applications.FindAsync(id);
        if (existing == null)
        {
            return null;
        }

        existing.AdopterName = application.AdopterName;
        existing.PetName     = application.PetName;
        existing.DateApplied = application.DateApplied;
        existing.Status      = application.Status;
        existing.Notes       = application.Notes;

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var application = await _db.Applications.FindAsync(id);
        if (application == null)
        {
            return false;
        }

        _db.Applications.Remove(application);
        await _db.SaveChangesAsync();
        return true;
    }
}
