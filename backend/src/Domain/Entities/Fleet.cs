using HadidOnline.Domain.Common;
using HadidOnline.Domain.Enums;

namespace HadidOnline.Domain.Entities;

public class Fleet : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Region { get; set; }
    public string? Description { get; set; }
    public ICollection<Vehicle> Vehicles { get; set; } = [];
}
