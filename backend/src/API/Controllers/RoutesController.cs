using HadidOnline.Application.Common;
using HadidOnline.Application.DTOs;
using HadidOnline.Application.Interfaces;
using HadidOnline.Domain.Entities;
using HadidOnline.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using H = HadidOnline.API.Controllers.ControllerHelpers;

namespace HadidOnline.API.Controllers;

[ApiController]
[Route("api/v1/routes")]
[Authorize]
public class RoutesController(IEntityService<Route> service) : ControllerBase
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
        var entity = new Route(); Apply(entity, request);
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

    private static void Apply(Route e, UpsertRouteDto d) { e.Name=d.Name; e.NameAr=d.NameAr; e.FromLocation=d.FromLocation; e.ToLocation=d.ToLocation; e.DistanceKm=d.DistanceKm; e.EstimatedDurationMinutes=d.EstimatedDurationMinutes; e.BasePrice=d.BasePrice; e.IsActive=d.IsActive; }
    private static RouteDto ToDto(Route e) => new RouteDto(e.Id,e.Name,e.NameAr,e.FromLocation,e.ToLocation,e.DistanceKm,e.EstimatedDurationMinutes,e.BasePrice,e.IsActive,e.CreatedAt);
    private static void SetStatus(Route e, string status) {
        if (e is Booking booking) booking.Status = H.ParseEnum<BookingStatus>(status);
        else if (e is Trip trip) { trip.Status = H.ParseEnum<TripStatus>(status); if (trip.Status == TripStatus.InProgress) trip.ActualStart = DateTimeOffset.UtcNow; if (trip.Status == TripStatus.Completed) trip.ActualEnd = DateTimeOffset.UtcNow; }
        else if (e is Contract contract) contract.Status = H.ParseEnum<ContractStatus>(status);
        else if (e is Invoice invoice) invoice.Status = H.ParseEnum<InvoiceStatus>(status);
        else if (e is Vehicle vehicle) vehicle.Status = H.ParseEnum<VehicleStatus>(status);
        else if (e is Driver driver) driver.Status = H.ParseEnum<DriverStatus>(status);
    }
}
