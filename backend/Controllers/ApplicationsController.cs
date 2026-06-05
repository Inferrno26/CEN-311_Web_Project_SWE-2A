using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PawsHeartsApi.Data;
using PawsHeartsApi.Models;

namespace PawsHeartsApi.Controllers;

[ApiController]
[Route("api/applications")]
public class ApplicationsController : ControllerBase
{
    private readonly PawsHeartsDbContext _db;

    public ApplicationsController(PawsHeartsDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Application>>> GetAll()
    {
        var applications = await _db.Applications.ToListAsync();
        return Ok(applications);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Application>> GetById(string id)
    {
        var application = await _db.Applications.FindAsync(id);
        if (application == null)
        {
            return NotFound();
        }
        return Ok(application);
    }

    [HttpPost]
    public async Task<ActionResult<Application>> Create(Application application)
    {
        application.Id = "APP-" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        _db.Applications.Add(application);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = application.Id }, application);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Application>> Update(string id, Application application)
    {
        var existing = await _db.Applications.FindAsync(id);
        if (existing == null)
        {
            return NotFound();
        }

        existing.AdopterName = application.AdopterName;
        existing.PetName     = application.PetName;
        existing.DateApplied = application.DateApplied;
        existing.Status      = application.Status;
        existing.Notes       = application.Notes;

        await _db.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var application = await _db.Applications.FindAsync(id);
        if (application == null)
        {
            return NotFound();
        }

        _db.Applications.Remove(application);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
