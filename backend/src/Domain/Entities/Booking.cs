using HadidOnline.Domain.Common;
using HadidOnline.Domain.Enums;

namespace HadidOnline.Domain.Entities;

public class Booking : BaseEntity
{
    public string BookingNumber { get; set; } = string.Empty;
    public Guid? CustomerId { get; set; }
    public Customer? Customer { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string ClientPhone { get; set; } = string.Empty;
    public string? ClientEmail { get; set; }
    public BookingTripType TripType { get; set; }
    public ContractBillingCycle ContractType { get; set; } = ContractBillingCycle.OneTime;
    public BookingStatus Status { get; set; } = BookingStatus.New;
    public string PickupLocation { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public DateOnly TripDate { get; set; }
    public TimeOnly TripTime { get; set; }
    public bool ReturnTrip { get; set; }
    public DateOnly? ReturnDate { get; set; }
    public TimeOnly? ReturnTime { get; set; }
    public int Passengers { get; set; } = 1;
    public Guid? VehicleId { get; set; }
    public Vehicle? Vehicle { get; set; }
    public Guid? DriverId { get; set; }
    public Driver? Driver { get; set; }
    public string? VehiclePreference { get; set; }
    public decimal? Price { get; set; }
    public string? Source { get; set; } = "website";
    public string? Notes { get; set; }
}
