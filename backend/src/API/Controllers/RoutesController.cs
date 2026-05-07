using HadidOnline.Application.Common;
using HadidOnline.Application.DTOs;
using HadidOnline.Application.Interfaces;
using HadidOnline.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HadidOnline.API.Controllers;

[ApiController]
[Route("api/v1/routes")]
[Authorize]
public class RoutesController(IEntityService<RouteEntity> service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiEnvelope<PagedResult<RouteDto>>>> List([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 25, [FromQuery] string? search = null, CancellationToken ct = default)
    {
        var result = await service.ListAsync(new QueryParameters(pageNumber, pageSize, search), ct);
        return Ok(ApiEnvelope<PagedResult<RouteDto>>.Ok(new PagedResult<RouteDto>(result.Items.Select(ToDto).ToList(), result.PageNumber, result.PageSize, result.TotalCount)));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiEnvelope<RouteDto>>> Get(Guid id, CancellationToken ct)
    {
        var entity = await service.GetAsync(id, ct);
        return entity is null ? NotFound(ApiEnvelope<RouteDto>.Fail("Not found")) : Ok(ApiEnvelope<RouteDto>.Ok(ToDto(entity)));
    }

    [HttpPost]
    public async Task<ActionResult<ApiEnvelope<RouteDto>>> Create(UpsertRouteDto request, CancellationToken ct)
    {
        var entity = new RouteEntity(); Apply(entity, request);
        entity = await service.CreateAsync(entity, ct);
        return CreatedAtAction(nameof(Get), new { id = entity.Id }, ApiEnvelope<RouteDto>.Ok(ToDto(entity), "Created"));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiEnvelope<RouteDto>>> Update(Guid id, UpsertRouteDto request, CancellationToken ct)
    {
        var updated = await service.UpdateAsync(id, e => Apply(e, request), ct);
        return updated is null ? NotFound(ApiEnvelope<RouteDto>.Fail("Not found")) : Ok(ApiEnvelope<RouteDto>.Ok(ToDto(updated), "Updated"));
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult<ApiEnvelope<RouteDto>>> UpdateStatus(Guid id, UpdateStatusDto request, CancellationToken ct)
    {
        var updated = await service.UpdateAsync(id, e => SetStatus(e, request.Status), ct);
        return updated is null ? NotFound(ApiEnvelope<RouteDto>.Fail("Not found")) : Ok(ApiEnvelope<RouteDto>.Ok(ToDto(updated), "Status updated"));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct) => await service.DeleteAsync(id, ct) ? NoContent() : NotFound(ApiEnvelope<object>.Fail("Not found"));

    private static void Apply(RouteEntity e, UpsertRouteDto d) { e.Name=d.Name; e.NameAr=d.NameAr; e.FromLocation=d.FromLocation; e.ToLocation=d.ToLocation; e.DistanceKm=d.DistanceKm; e.EstimatedDurationMinutes=d.EstimatedDurationMinutes; e.BasePrice=d.BasePrice; e.IsActive=d.IsActive; }
    private static RouteDto ToDto(RouteEntity e) => new RouteDto(e.Id,e.Name,e.NameAr,e.FromLocation,e.ToLocation,e.DistanceKm,e.EstimatedDurationMinutes,e.BasePrice,e.IsActive,e.CreatedAt);
    private static void SetStatus(RouteEntity e, string status) => e.IsActive = status.Equals("active", StringComparison.OrdinalIgnoreCase) || status.Equals("true", StringComparison.OrdinalIgnoreCase);
}
