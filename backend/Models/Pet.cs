namespace PawsHeartsApi.Models;

public class Pet
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public int Age { get; set; }
    public decimal Weight { get; set; }
    public string Location { get; set; } = "";
    public string Gender { get; set; } = "";
    public string Type { get; set; } = "";
    public string Status { get; set; } = "";
    public string Description { get; set; } = "";
}
