using HadidOnline.Domain.Common;
using HadidOnline.Domain.Enums;

namespace HadidOnline.Domain.Entities;

public class Trip : BaseEntity
{
    public Guid? BookingId { get; set; }
    public Booking? Booking { get; set; }
    public Guid? ContractId { get; set; }
    public Contract? Contract { get; set; }
    public Guid? VehicleId { get; set; }
    public Vehicle? Vehicle { get; set; }
    public Guid? DriverId { get; set; }
    public Driver? Driver { get; set; }
    public Guid? RouteId { get; set; }
    public RouteEntity? Route { get; set; }
    public TripStatus Status { get; set; } = TripStatus.Scheduled;
    public DateOnly ScheduledDate { get; set; }
    public TimeOnly ScheduledTime { get; set; }
    public DateTimeOffset? ActualStart { get; set; }
    public DateTimeOffset? ActualEnd { get; set; }
    public string PickupLocation { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public int Passengers { get; set; } = 1;
    public string? Notes { get; set; }
}
