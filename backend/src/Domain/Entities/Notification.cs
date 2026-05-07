using HadidOnline.Domain.Common;
using HadidOnline.Domain.Enums;

namespace HadidOnline.Domain.Entities;

public class Notification : BaseEntity
{
    public Guid? UserId { get; set; }
    public User? User { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = "info";
    public NotificationStatus Status { get; set; } = NotificationStatus.Unread;
}
