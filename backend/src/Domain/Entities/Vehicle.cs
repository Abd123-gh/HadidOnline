using HadidOnline.Domain.Common;
using HadidOnline.Domain.Enums;

namespace HadidOnline.Domain.Entities;

public class Vehicle : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public VehicleType Type { get; set; }
    public string PlateNumber { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public string? Model { get; set; }
    public int? Year { get; set; }
    public bool HasAc { get; set; } = true;
    public bool HasWifi { get; set; }
    public bool HasLuggageSpace { get; set; } = true;
    public ComfortLevel ComfortLevel { get; set; } = ComfortLevel.Standard;
    public VehicleStatus Status { get; set; } = VehicleStatus.Available;
    public string? ImageUrl { get; set; }
    public string? Notes { get; set; }
    public DateOnly? LastMaintenanceDate { get; set; }
    public DateOnly? NextMaintenanceDate { get; set; }
    public ICollection<MaintenanceRecord> MaintenanceRecords { get; set; } = [];
}
