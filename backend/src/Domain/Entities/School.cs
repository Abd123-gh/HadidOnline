using HadidOnline.Domain.Common;
using HadidOnline.Domain.Enums;

namespace HadidOnline.Domain.Entities;

public class School : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? PrincipalName { get; set; }
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Address { get; set; }
    public int StudentCapacity { get; set; }
}
