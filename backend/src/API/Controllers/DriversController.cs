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
[Route("api/v1/drivers")]
[Authorize]
public class DriversController(IEntityService<Driver> service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiEnvelope<PagedResult<DriverDto>>>> List([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 25, [FromQuery] string? search = null, CancellationToken ct = default)
    {
        var result = await service.ListAsync(new QueryParameters(pageNumber, pageSize, search), ct);
        return Ok(ApiEnvelope<PagedResult<DriverDto>>.Ok(new PagedResult<DriverDto>(result.Items.Select(ToDto).ToList(), result.PageNumber, result.PageSize, result.TotalCount)));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiEnvelope<DriverDto>>> Get(Guid id, CancellationToken ct)
    {
        var entity = await service.GetAsync(id, ct);
        return entity is null ? NotFound(ApiEnvelope<DriverDto>.Fail("Not found")) : Ok(ApiEnvelope<DriverDto>.Ok(ToDto(entity)));
    }

    [HttpPost]
    public async Task<ActionResult<ApiEnvelope<DriverDto>>> Create(UpsertDriverDto request, CancellationToken ct)
    {
        var entity = new Driver(); Apply(entity, request);
        entity = await service.CreateAsync(entity, ct);
        return CreatedAtAction(nameof(Get), new { id = entity.Id }, ApiEnvelope<DriverDto>.Ok(ToDto(entity), "Created"));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiEnvelope<DriverDto>>> Update(Guid id, UpsertDriverDto request, CancellationToken ct)
    {
        var updated = await service.UpdateAsync(id, e => Apply(e, request), ct);
        return updated is null ? NotFound(ApiEnvelope<DriverDto>.Fail("Not found")) : Ok(ApiEnvelope<DriverDto>.Ok(ToDto(updated), "Updated"));
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult<ApiEnvelope<DriverDto>>> UpdateStatus(Guid id, UpdateStatusDto request, CancellationToken ct)
    {
        var updated = await service.UpdateAsync(id, e => SetStatus(e, request.Status), ct);
        return updated is null ? NotFound(ApiEnvelope<DriverDto>.Fail("Not found")) : Ok(ApiEnvelope<DriverDto>.Ok(ToDto(updated), "Status updated"));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct) => await service.DeleteAsync(id, ct) ? NoContent() : NotFound(ApiEnvelope<object>.Fail("Not found"));

    private static void Apply(Driver e, UpsertDriverDto d) { e.FullName=d.FullName; e.Phone=d.Phone; e.Email=d.Email; e.LicenseNumber=d.LicenseNumber; e.LicenseExpiry=d.LicenseExpiry; e.NationalId=d.NationalId; e.Status=H.ParseEnum<DriverStatus>(d.Status); e.Rating=d.Rating; e.TotalTrips=d.TotalTrips; e.Notes=d.Notes; }
    private static DriverDto ToDto(Driver e) => new DriverDto(e.Id,e.FullName,e.Phone,e.Email,e.LicenseNumber,e.LicenseExpiry,e.Status.ToWire(),e.Rating,e.TotalTrips,e.Notes,e.CreatedAt);
    private static void SetStatus(Driver e, string status) {
        if (e is Booking booking) booking.Status = H.ParseEnum<BookingStatus>(status);
        else if (e is Trip trip) { trip.Status = H.ParseEnum<TripStatus>(status); if (trip.Status == TripStatus.InProgress) trip.ActualStart = DateTimeOffset.UtcNow; if (trip.Status == TripStatus.Completed) trip.ActualEnd = DateTimeOffset.UtcNow; }
        else if (e is Contract contract) contract.Status = H.ParseEnum<ContractStatus>(status);
        else if (e is Invoice invoice) invoice.Status = H.ParseEnum<InvoiceStatus>(status);
        else if (e is Vehicle vehicle) vehicle.Status = H.ParseEnum<VehicleStatus>(status);
        else if (e is Driver driver) driver.Status = H.ParseEnum<DriverStatus>(status);
    }
}
