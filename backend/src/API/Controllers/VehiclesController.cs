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
[Route("api/v1/fleet/vehicles")]
[Authorize]
public class VehiclesController(IEntityService<Vehicle> service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiEnvelope<PagedResult<VehicleDto>>>> List([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 25, [FromQuery] string? search = null, CancellationToken ct = default)
    {
        var result = await service.ListAsync(new QueryParameters(pageNumber, pageSize, search), ct);
        return Ok(ApiEnvelope<PagedResult<VehicleDto>>.Ok(new PagedResult<VehicleDto>(result.Items.Select(ToDto).ToList(), result.PageNumber, result.PageSize, result.TotalCount)));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiEnvelope<VehicleDto>>> Get(Guid id, CancellationToken ct)
    {
        var entity = await service.GetAsync(id, ct);
        return entity is null ? NotFound(ApiEnvelope<VehicleDto>.Fail("Not found")) : Ok(ApiEnvelope<VehicleDto>.Ok(ToDto(entity)));
    }

    [HttpPost]
    public async Task<ActionResult<ApiEnvelope<VehicleDto>>> Create(UpsertVehicleDto request, CancellationToken ct)
    {
        var entity = new Vehicle(); Apply(entity, request);
        entity = await service.CreateAsync(entity, ct);
        return CreatedAtAction(nameof(Get), new { id = entity.Id }, ApiEnvelope<VehicleDto>.Ok(ToDto(entity), "Created"));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiEnvelope<VehicleDto>>> Update(Guid id, UpsertVehicleDto request, CancellationToken ct)
    {
        var updated = await service.UpdateAsync(id, e => Apply(e, request), ct);
        return updated is null ? NotFound(ApiEnvelope<VehicleDto>.Fail("Not found")) : Ok(ApiEnvelope<VehicleDto>.Ok(ToDto(updated), "Updated"));
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult<ApiEnvelope<VehicleDto>>> UpdateStatus(Guid id, UpdateStatusDto request, CancellationToken ct)
    {
        var updated = await service.UpdateAsync(id, e => SetStatus(e, request.Status), ct);
        return updated is null ? NotFound(ApiEnvelope<VehicleDto>.Fail("Not found")) : Ok(ApiEnvelope<VehicleDto>.Ok(ToDto(updated), "Status updated"));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct) => await service.DeleteAsync(id, ct) ? NoContent() : NotFound(ApiEnvelope<object>.Fail("Not found"));

    private static void Apply(Vehicle e, UpsertVehicleDto d) { e.Name=d.Name; e.Type=H.ParseEnum<VehicleType>(d.Type); e.PlateNumber=d.PlateNumber; e.Capacity=d.Capacity; e.Model=d.Model; e.Year=d.Year; e.HasAc=d.HasAc; e.HasWifi=d.HasWifi; e.HasLuggageSpace=d.HasLuggageSpace; e.ComfortLevel=H.ParseEnum<ComfortLevel>(d.ComfortLevel); e.Status=H.ParseEnum<VehicleStatus>(d.Status); e.ImageUrl=d.ImageUrl; e.Notes=d.Notes; e.LastMaintenanceDate=d.LastMaintenanceDate; e.NextMaintenanceDate=d.NextMaintenanceDate; }
    private static VehicleDto ToDto(Vehicle e) => new VehicleDto(e.Id,e.Name,e.Type.ToWire(),e.PlateNumber,e.Capacity,e.Model,e.Year,e.HasAc,e.HasWifi,e.HasLuggageSpace,e.ComfortLevel.ToWire(),e.Status.ToWire(),e.ImageUrl,e.Notes,e.LastMaintenanceDate,e.NextMaintenanceDate,e.CreatedAt);
    private static void SetStatus(Vehicle e, string status) {
        if (e is Booking booking) booking.Status = H.ParseEnum<BookingStatus>(status);
        else if (e is Trip trip) { trip.Status = H.ParseEnum<TripStatus>(status); if (trip.Status == TripStatus.InProgress) trip.ActualStart = DateTimeOffset.UtcNow; if (trip.Status == TripStatus.Completed) trip.ActualEnd = DateTimeOffset.UtcNow; }
        else if (e is Contract contract) contract.Status = H.ParseEnum<ContractStatus>(status);
        else if (e is Invoice invoice) invoice.Status = H.ParseEnum<InvoiceStatus>(status);
        else if (e is Vehicle vehicle) vehicle.Status = H.ParseEnum<VehicleStatus>(status);
        else if (e is Driver driver) driver.Status = H.ParseEnum<DriverStatus>(status);
    }
}
