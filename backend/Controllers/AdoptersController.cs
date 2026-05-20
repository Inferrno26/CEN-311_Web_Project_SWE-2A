using Microsoft.AspNetCore.Mvc;
using PawsHeartsApi.Models;

namespace PawsHeartsApi.Controllers;

[ApiController]
[Route("api/adopters")]
public class AdoptersController : ControllerBase
{
    private static List<Adopter> _adopters = new List<Adopter>
    {
        new Adopter { Id = 1, Name = "Jane Doe",    Phone = "+355 69 123 4567", Email = "jane.doe@email.com",    Address = "Tirana, AL" },
        new Adopter { Id = 2, Name = "John Smith",  Phone = "+355 69 234 5678", Email = "john.smith@email.com",  Address = "Durres, AL" }
    };

    [HttpGet]
    public ActionResult<IEnumerable<Adopter>> GetAll()
    {
        return Ok(_adopters);
    }

    [HttpGet("{id}")]
    public ActionResult<Adopter> GetById(int id)
    {
        var adopter = _adopters.FirstOrDefault(a => a.Id == id);
        if (adopter == null)
        {
            return NotFound();
        }
        return Ok(adopter);
    }

    [HttpPost]
    public ActionResult<Adopter> Create(Adopter adopter)
    {
        adopter.Id = _adopters.Count == 0 ? 1 : _adopters.Max(a => a.Id) + 1;
        _adopters.Add(adopter);
        return CreatedAtAction(nameof(GetById), new { id = adopter.Id }, adopter);
    }

    [HttpPut("{id}")]
    public ActionResult<Adopter> Update(int id, Adopter adopter)
    {
        var existing = _adopters.FirstOrDefault(a => a.Id == id);
        if (existing == null)
        {
            return NotFound();
        }

        existing.Name    = adopter.Name;
        existing.Phone   = adopter.Phone;
        existing.Email   = adopter.Email;
        existing.Address = adopter.Address;

        return Ok(existing);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var adopter = _adopters.FirstOrDefault(a => a.Id == id);
        if (adopter == null)
        {
            return NotFound();
        }
        _adopters.Remove(adopter);
        return NoContent();
    }
}
