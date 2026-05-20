using Microsoft.AspNetCore.Mvc;
using PawsHeartsApi.Models;

namespace PawsHeartsApi.Controllers;

[ApiController]
[Route("api/pets")]
public class PetsController : ControllerBase
{
    private static List<Pet> _pets = new List<Pet>
    {
        new Pet { Id = 1, Name = "Max",     Age = 2, Weight = 11.5m, Location = "Tirana, AL", Gender = "Male",   Type = "Dog", Status = "Available", Description = "Friendly Golden Retriever" },
        new Pet { Id = 2, Name = "Luna",    Age = 1, Weight = 4.0m,  Location = "Durres, AL", Gender = "Female", Type = "Cat", Status = "Available", Description = "Calm and affectionate" },
        new Pet { Id = 3, Name = "Charlie", Age = 3, Weight = 12.0m, Location = "Vlore, AL",  Gender = "Male",   Type = "Dog", Status = "Pending",   Description = "Playful Beagle" }
    };

    [HttpGet]
    public ActionResult<IEnumerable<Pet>> GetAll()
    {
        return Ok(_pets);
    }

    [HttpGet("{id}")]
    public ActionResult<Pet> GetById(int id)
    {
        var pet = _pets.FirstOrDefault(p => p.Id == id);
        if (pet == null)
        {
            return NotFound();
        }
        return Ok(pet);
    }

    [HttpPost]
    public ActionResult<Pet> Create(Pet pet)
    {
        pet.Id = _pets.Count == 0 ? 1 : _pets.Max(p => p.Id) + 1;
        _pets.Add(pet);
        return CreatedAtAction(nameof(GetById), new { id = pet.Id }, pet);
    }

    [HttpPut("{id}")]
    public ActionResult<Pet> Update(int id, Pet pet)
    {
        var existing = _pets.FirstOrDefault(p => p.Id == id);
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

        return Ok(existing);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var pet = _pets.FirstOrDefault(p => p.Id == id);
        if (pet == null)
        {
            return NotFound();
        }
        _pets.Remove(pet);
        return NoContent();
    }
}
