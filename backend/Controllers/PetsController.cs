using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PawsHeartsApi.Data;
using PawsHeartsApi.Models;

namespace PawsHeartsApi.Controllers;

[ApiController]
[Route("api/pets")]
public class PetsController : ControllerBase
{
    private readonly PawsHeartsDbContext _db;

    public PetsController(PawsHeartsDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Pet>>> GetAll()
    {
        var pets = await _db.Pets.ToListAsync();
        return Ok(pets);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Pet>> GetById(int id)
    {
        var pet = await _db.Pets.FindAsync(id);
        if (pet == null)
        {
            return NotFound();
        }
        return Ok(pet);
    }

    [HttpPost]
    public async Task<ActionResult<Pet>> Create(Pet pet)
    {
        _db.Pets.Add(pet);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = pet.Id }, pet);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Pet>> Update(int id, Pet pet)
    {
        var existing = await _db.Pets.FindAsync(id);
        if (existing == null)
        {
            return NotFound();
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
        return Ok(existing);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var pet = await _db.Pets.FindAsync(id);
        if (pet == null)
        {
            return NotFound();
        }

        _db.Pets.Remove(pet);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
