using HadidOnline.Domain.Common;
using HadidOnline.Domain.Enums;

namespace HadidOnline.Domain.Entities;

public class TourPackage : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string NameAr { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? DescriptionAr { get; set; }
    public string Destination { get; set; } = string.Empty;
    public int DurationDays { get; set; } = 1;
    public decimal? PricePerPerson { get; set; }
    public int MinPassengers { get; set; } = 1;
    public int MaxPassengers { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsActive { get; set; } = true;
}
