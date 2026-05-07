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
[Route("api/v1/invoices")]
[Authorize]
public class InvoicesController(IEntityService<Invoice> service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiEnvelope<PagedResult<InvoiceDto>>>> List([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 25, [FromQuery] string? search = null, CancellationToken ct = default)
    {
        var result = await service.ListAsync(new QueryParameters(pageNumber, pageSize, search), ct);
        return Ok(ApiEnvelope<PagedResult<InvoiceDto>>.Ok(new PagedResult<InvoiceDto>(result.Items.Select(ToDto).ToList(), result.PageNumber, result.PageSize, result.TotalCount)));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiEnvelope<InvoiceDto>>> Get(Guid id, CancellationToken ct)
    {
        var entity = await service.GetAsync(id, ct);
        return entity is null ? NotFound(ApiEnvelope<InvoiceDto>.Fail("Not found")) : Ok(ApiEnvelope<InvoiceDto>.Ok(ToDto(entity)));
    }

    [HttpPost]
    public async Task<ActionResult<ApiEnvelope<InvoiceDto>>> Create(UpsertInvoiceDto request, CancellationToken ct)
    {
        var entity = new Invoice(); Apply(entity, request);
        entity = await service.CreateAsync(entity, ct);
        return CreatedAtAction(nameof(Get), new { id = entity.Id }, ApiEnvelope<InvoiceDto>.Ok(ToDto(entity), "Created"));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiEnvelope<InvoiceDto>>> Update(Guid id, UpsertInvoiceDto request, CancellationToken ct)
    {
        var updated = await service.UpdateAsync(id, e => Apply(e, request), ct);
        return updated is null ? NotFound(ApiEnvelope<InvoiceDto>.Fail("Not found")) : Ok(ApiEnvelope<InvoiceDto>.Ok(ToDto(updated), "Updated"));
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult<ApiEnvelope<InvoiceDto>>> UpdateStatus(Guid id, UpdateStatusDto request, CancellationToken ct)
    {
        var updated = await service.UpdateAsync(id, e => SetStatus(e, request.Status), ct);
        return updated is null ? NotFound(ApiEnvelope<InvoiceDto>.Fail("Not found")) : Ok(ApiEnvelope<InvoiceDto>.Ok(ToDto(updated), "Status updated"));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct) => await service.DeleteAsync(id, ct) ? NoContent() : NotFound(ApiEnvelope<object>.Fail("Not found"));

    private static void Apply(Invoice e, UpsertInvoiceDto d) { e.InvoiceNumber = string.IsNullOrWhiteSpace(e.InvoiceNumber) ? $"INV-{DateTime.UtcNow:yyyy}-{Random.Shared.Next(10000,99999)}" : e.InvoiceNumber; e.CustomerId=d.CustomerId; e.BookingId=d.BookingId; e.ContractId=d.ContractId; e.Amount=d.Amount; e.TaxAmount=d.TaxAmount; e.TotalAmount=d.TotalAmount; e.Status=H.ParseEnum<InvoiceStatus>(d.Status); e.DueDate=d.DueDate; e.PaidDate=d.PaidDate; e.PaymentMethod=d.PaymentMethod; e.Notes=d.Notes; }
    private static InvoiceDto ToDto(Invoice e) => new InvoiceDto(e.Id,e.InvoiceNumber,e.CustomerId,e.Amount,e.TaxAmount,e.TotalAmount,e.Status.ToWire(),e.DueDate,e.PaidDate,e.CreatedAt);
    private static void SetStatus(Invoice e, string status) {
        if (e is Booking booking) booking.Status = H.ParseEnum<BookingStatus>(status);
        else if (e is Trip trip) { trip.Status = H.ParseEnum<TripStatus>(status); if (trip.Status == TripStatus.InProgress) trip.ActualStart = DateTimeOffset.UtcNow; if (trip.Status == TripStatus.Completed) trip.ActualEnd = DateTimeOffset.UtcNow; }
        else if (e is Contract contract) contract.Status = H.ParseEnum<ContractStatus>(status);
        else if (e is Invoice invoice) invoice.Status = H.ParseEnum<InvoiceStatus>(status);
        else if (e is Vehicle vehicle) vehicle.Status = H.ParseEnum<VehicleStatus>(status);
        else if (e is Driver driver) driver.Status = H.ParseEnum<DriverStatus>(status);
    }
}
