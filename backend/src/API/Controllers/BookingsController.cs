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
[Route("api/v1/bookings")]
[Authorize]
public class BookingsController(IEntityService<Booking> service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiEnvelope<PagedResult<BookingDto>>>> List([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 25, [FromQuery] string? search = null, CancellationToken ct = default)
    {
        var result = await service.ListAsync(new QueryParameters(pageNumber, pageSize, search), ct);
        return Ok(ApiEnvelope<PagedResult<BookingDto>>.Ok(new PagedResult<BookingDto>(result.Items.Select(ToDto).ToList(), result.PageNumber, result.PageSize, result.TotalCount)));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiEnvelope<BookingDto>>> Get(Guid id, CancellationToken ct)
    {
        var entity = await service.GetAsync(id, ct);
        return entity is null ? NotFound(ApiEnvelope<BookingDto>.Fail("Not found")) : Ok(ApiEnvelope<BookingDto>.Ok(ToDto(entity)));
    }

    [HttpPost]
    public async Task<ActionResult<ApiEnvelope<BookingDto>>> Create(UpsertBookingDto request, CancellationToken ct)
    {
        var entity = new Booking(); Apply(entity, request);
        entity = await service.CreateAsync(entity, ct);
        return CreatedAtAction(nameof(Get), new { id = entity.Id }, ApiEnvelope<BookingDto>.Ok(ToDto(entity), "Created"));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiEnvelope<BookingDto>>> Update(Guid id, UpsertBookingDto request, CancellationToken ct)
    {
        var updated = await service.UpdateAsync(id, e => Apply(e, request), ct);
        return updated is null ? NotFound(ApiEnvelope<BookingDto>.Fail("Not found")) : Ok(ApiEnvelope<BookingDto>.Ok(ToDto(updated), "Updated"));
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult<ApiEnvelope<BookingDto>>> UpdateStatus(Guid id, UpdateStatusDto request, CancellationToken ct)
    {
        var updated = await service.UpdateAsync(id, e => SetStatus(e, request.Status), ct);
        return updated is null ? NotFound(ApiEnvelope<BookingDto>.Fail("Not found")) : Ok(ApiEnvelope<BookingDto>.Ok(ToDto(updated), "Status updated"));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct) => await service.DeleteAsync(id, ct) ? NoContent() : NotFound(ApiEnvelope<object>.Fail("Not found"));

    private static void Apply(Booking e, UpsertBookingDto d) { e.BookingNumber = string.IsNullOrWhiteSpace(e.BookingNumber) ? $"BK-{DateTime.UtcNow:yyyy}-{Random.Shared.Next(10000,99999)}" : e.BookingNumber; e.ClientName=d.ClientName; e.ClientPhone=d.ClientPhone; e.ClientEmail=d.ClientEmail; e.TripType=H.ParseEnum<BookingTripType>(d.TripType); e.ContractType=H.ParseEnum<ContractBillingCycle>(d.ContractType); e.PickupLocation=d.PickupLocation; e.Destination=d.Destination; e.TripDate=d.TripDate; e.TripTime=d.TripTime; e.ReturnTrip=d.ReturnTrip; e.ReturnDate=d.ReturnDate; e.ReturnTime=d.ReturnTime; e.Passengers=d.Passengers; e.VehicleId=d.VehicleId; e.DriverId=d.DriverId; e.VehiclePreference=d.VehiclePreference; e.Price=d.Price; e.Source=d.Source; e.Notes=d.Notes; }
    private static BookingDto ToDto(Booking e) => new BookingDto(e.Id,e.BookingNumber,e.ClientName,e.ClientPhone,e.ClientEmail,e.TripType.ToWire(),e.ContractType.ToWire(),e.Status.ToWire(),e.PickupLocation,e.Destination,e.TripDate,e.TripTime,e.ReturnTrip,e.Passengers,e.VehiclePreference,e.Price,e.Notes,e.CreatedAt);
    private static void SetStatus(Booking e, string status) => e.Status = H.ParseEnum<BookingStatus>(status);
}
