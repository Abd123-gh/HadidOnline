using HadidOnline.Domain.Common;
using HadidOnline.Domain.Enums;

namespace HadidOnline.Domain.Entities;

public class Customer : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public ClientType Type { get; set; } = ClientType.Individual;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? ContactPerson { get; set; }
    public string? CompanyName { get; set; }
    public string? TaxNumber { get; set; }
    public ClientStatus Status { get; set; } = ClientStatus.Active;
    public ICollection<Booking> Bookings { get; set; } = [];
    public ICollection<Invoice> Invoices { get; set; } = [];
}
