using HadidOnline.Domain.Common;
using HadidOnline.Domain.Enums;

namespace HadidOnline.Domain.Entities;

public class Driver : BaseEntity
{
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string LicenseNumber { get; set; } = string.Empty;
    public DateOnly LicenseExpiry { get; set; }
    public string? NationalId { get; set; }
    public DriverStatus Status { get; set; } = DriverStatus.Available;
    public decimal Rating { get; set; } = 5;
    public int TotalTrips { get; set; }
    public string? Notes { get; set; }
    public string? AvatarUrl { get; set; }
}
