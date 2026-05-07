using HadidOnline.Domain.Common;
using HadidOnline.Domain.Enums;

namespace HadidOnline.Domain.Entities;

public class Invoice : BaseEntity
{
    public string InvoiceNumber { get; set; } = string.Empty;
    public Guid? CustomerId { get; set; }
    public Customer? Customer { get; set; }
    public Guid? BookingId { get; set; }
    public Booking? Booking { get; set; }
    public Guid? ContractId { get; set; }
    public Contract? Contract { get; set; }
    public decimal Amount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public InvoiceStatus Status { get; set; } = InvoiceStatus.Pending;
    public DateOnly? DueDate { get; set; }
    public DateOnly? PaidDate { get; set; }
    public string? PaymentMethod { get; set; }
    public string? Notes { get; set; }
}
