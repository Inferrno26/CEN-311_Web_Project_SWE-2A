using Microsoft.AspNetCore.Mvc;
using PawsHeartsApi.Models;
using PawsHeartsApi.Services;

namespace PawsHeartsApi.Controllers;

[ApiController]
[Route("api/pets")]
public class PetsController : ControllerBase
{
    private readonly PetService _petService;

    public PetsController(PetService petService)
    {
        _petService = petService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Pet>>> GetAll()
    {
        var pets = await _petService.GetAllAsync();
        return Ok(pets);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Pet>> GetById(int id)
    {
        var pet = await _petService.GetByIdAsync(id);
        if (pet == null)
        {
            return NotFound();
        }
        return Ok(pet);
    }

    [HttpPost]
    public async Task<ActionResult<Pet>> Create(Pet pet)
    {
        var created = await _petService.CreateAsync(pet);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Pet>> Update(int id, Pet pet)
    {
        var updated = await _petService.UpdateAsync(id, pet);
        if (updated == null)
        {
            return NotFound();
        }
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _petService.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound();
        }
        return NoContent();
    }
}
