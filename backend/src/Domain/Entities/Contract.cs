using HadidOnline.Domain.Common;
using HadidOnline.Domain.Enums;

namespace HadidOnline.Domain.Entities;

public class Contract : BaseEntity
{
    public string ContractNumber { get; set; } = string.Empty;
    public Guid? CustomerId { get; set; }
    public Customer? Customer { get; set; }
    public Guid? CompanyId { get; set; }
    public Company? Company { get; set; }
    public ContractType Type { get; set; }
    public ContractStatus Status { get; set; } = ContractStatus.New;
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public decimal? MonthlyAmount { get; set; }
    public decimal? TotalAmount { get; set; }
    public ContractBillingCycle BillingCycle { get; set; } = ContractBillingCycle.Monthly;
    public string? Terms { get; set; }
    public string? Notes { get; set; }
}
