using Microsoft.AspNetCore.Mvc;
using PawsHeartsApi.Models;
using PawsHeartsApi.Services;

namespace PawsHeartsApi.Controllers;

[ApiController]
[Route("api/adopters")]
public class AdoptersController : ControllerBase
{
    private readonly AdopterService _adopterService;

    public AdoptersController(AdopterService adopterService)
    {
        _adopterService = adopterService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Adopter>>> GetAll()
    {
        var adopters = await _adopterService.GetAllAsync();
        return Ok(adopters);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Adopter>> GetById(int id)
    {
        var adopter = await _adopterService.GetByIdAsync(id);
        if (adopter == null)
        {
            return NotFound();
        }
        return Ok(adopter);
    }

    [HttpPost]
    public async Task<ActionResult<Adopter>> Create(Adopter adopter)
    {
        var created = await _adopterService.CreateAsync(adopter);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Adopter>> Update(int id, Adopter adopter)
    {
        var updated = await _adopterService.UpdateAsync(id, adopter);
        if (updated == null)
        {
            return NotFound();
        }
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _adopterService.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound();
        }
        return NoContent();
    }
}
