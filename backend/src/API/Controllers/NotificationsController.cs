using HadidOnline.Application.Common;
using HadidOnline.Application.DTOs;
using HadidOnline.Application.Interfaces;
using HadidOnline.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using H = HadidOnline.API.Controllers.ControllerHelpers;

namespace HadidOnline.API.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/notifications")]
public class NotificationsController(IEntityService<Notification> service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiEnvelope<PagedResult<NotificationDto>>>> List([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 25, CancellationToken ct = default)
    {
        var r = await service.ListAsync(new QueryParameters(pageNumber, pageSize), ct);
        return Ok(ApiEnvelope<PagedResult<NotificationDto>>.Ok(new PagedResult<NotificationDto>(r.Items.Select(x => new NotificationDto(x.Id,x.Title,x.Message,x.Type,x.Status.ToWire(),x.CreatedAt)).ToList(), r.PageNumber, r.PageSize, r.TotalCount)));
    }
}
