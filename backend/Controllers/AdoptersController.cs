using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PawsHeartsApi.Data;
using PawsHeartsApi.Models;

namespace PawsHeartsApi.Controllers;

[ApiController]
[Route("api/adopters")]
public class AdoptersController : ControllerBase
{
    private readonly PawsHeartsDbContext _db;

    public AdoptersController(PawsHeartsDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Adopter>>> GetAll()
    {
        var adopters = await _db.Adopters.ToListAsync();
        return Ok(adopters);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Adopter>> GetById(int id)
    {
        var adopter = await _db.Adopters.FindAsync(id);
        if (adopter == null)
        {
            return NotFound();
        }
        return Ok(adopter);
    }

    [HttpPost]
    public async Task<ActionResult<Adopter>> Create(Adopter adopter)
    {
        _db.Adopters.Add(adopter);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = adopter.Id }, adopter);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Adopter>> Update(int id, Adopter adopter)
    {
        var existing = await _db.Adopters.FindAsync(id);
        if (existing == null)
        {
            return NotFound();
        }

        existing.Name    = adopter.Name;
        existing.Phone   = adopter.Phone;
        existing.Email   = adopter.Email;
        existing.Address = adopter.Address;

        await _db.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var adopter = await _db.Adopters.FindAsync(id);
        if (adopter == null)
        {
            return NotFound();
        }

        _db.Adopters.Remove(adopter);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
