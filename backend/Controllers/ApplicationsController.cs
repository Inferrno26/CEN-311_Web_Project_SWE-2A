using Microsoft.AspNetCore.Mvc;
using PawsHeartsApi.Models;

namespace PawsHeartsApi.Controllers;

[ApiController]
[Route("api/applications")]
public class ApplicationsController : ControllerBase
{
    private static List<Application> _applications = new List<Application>
    {
        new Application { Id = "APP-1", AdopterName = "Jane Doe",   PetName = "Max",  DateApplied = "2026-05-10", Status = "Pending",  Notes = "" },
        new Application { Id = "APP-2", AdopterName = "John Smith", PetName = "Luna", DateApplied = "2026-05-12", Status = "Approved", Notes = "Verified references" }
    };

    [HttpGet]
    public ActionResult<IEnumerable<Application>> GetAll()
    {
        return Ok(_applications);
    }

    [HttpGet("{id}")]
    public ActionResult<Application> GetById(string id)
    {
        var application = _applications.FirstOrDefault(a => a.Id == id);
        if (application == null)
        {
            return NotFound();
        }
        return Ok(application);
    }

    [HttpPost]
    public ActionResult<Application> Create(Application application)
    {
        application.Id = "APP-" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        _applications.Add(application);
        return CreatedAtAction(nameof(GetById), new { id = application.Id }, application);
    }

    [HttpPut("{id}")]
    public ActionResult<Application> Update(string id, Application application)
    {
        var existing = _applications.FirstOrDefault(a => a.Id == id);
        if (existing == null)
        {
            return NotFound();
        }

        existing.AdopterName = application.AdopterName;
        existing.PetName     = application.PetName;
        existing.DateApplied = application.DateApplied;
        existing.Status      = application.Status;
        existing.Notes       = application.Notes;

        return Ok(existing);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(string id)
    {
        var application = _applications.FirstOrDefault(a => a.Id == id);
        if (application == null)
        {
            return NotFound();
        }
        _applications.Remove(application);
        return NoContent();
    }
}
