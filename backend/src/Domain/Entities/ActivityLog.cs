using HadidOnline.Domain.Common;
using HadidOnline.Domain.Enums;

namespace HadidOnline.Domain.Entities;

public class ActivityLog : BaseEntity
{
    public string EntityType { get; set; } = string.Empty;
    public Guid? EntityId { get; set; }
    public string Action { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? UserName { get; set; }
}
