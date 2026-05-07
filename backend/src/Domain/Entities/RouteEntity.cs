using HadidOnline.Domain.Common;

namespace HadidOnline.Domain.Entities;

public class RouteEntity : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? NameAr { get; set; }
    public string FromLocation { get; set; } = string.Empty;
    public string ToLocation { get; set; } = string.Empty;
    public decimal? DistanceKm { get; set; }
    public int? EstimatedDurationMinutes { get; set; }
    public decimal? BasePrice { get; set; }
    public bool IsActive { get; set; } = true;
}
