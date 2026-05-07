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
[Route("api/v1/customers")]
[Authorize]
public class CustomersController(IEntityService<Customer> service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiEnvelope<PagedResult<CustomerDto>>>> List([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 25, [FromQuery] string? search = null, CancellationToken ct = default)
    {
        var result = await service.ListAsync(new QueryParameters(pageNumber, pageSize, search), ct);
        return Ok(ApiEnvelope<PagedResult<CustomerDto>>.Ok(new PagedResult<CustomerDto>(result.Items.Select(ToDto).ToList(), result.PageNumber, result.PageSize, result.TotalCount)));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiEnvelope<CustomerDto>>> Get(Guid id, CancellationToken ct)
    {
        var entity = await service.GetAsync(id, ct);
        return entity is null ? NotFound(ApiEnvelope<CustomerDto>.Fail("Not found")) : Ok(ApiEnvelope<CustomerDto>.Ok(ToDto(entity)));
    }

    [HttpPost]
    public async Task<ActionResult<ApiEnvelope<CustomerDto>>> Create(UpsertCustomerDto request, CancellationToken ct)
    {
        var entity = new Customer(); Apply(entity, request);
        entity = await service.CreateAsync(entity, ct);
        return CreatedAtAction(nameof(Get), new { id = entity.Id }, ApiEnvelope<CustomerDto>.Ok(ToDto(entity), "Created"));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiEnvelope<CustomerDto>>> Update(Guid id, UpsertCustomerDto request, CancellationToken ct)
    {
        var updated = await service.UpdateAsync(id, e => Apply(e, request), ct);
        return updated is null ? NotFound(ApiEnvelope<CustomerDto>.Fail("Not found")) : Ok(ApiEnvelope<CustomerDto>.Ok(ToDto(updated), "Updated"));
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult<ApiEnvelope<CustomerDto>>> UpdateStatus(Guid id, UpdateStatusDto request, CancellationToken ct)
    {
        var updated = await service.UpdateAsync(id, e => SetStatus(e, request.Status), ct);
        return updated is null ? NotFound(ApiEnvelope<CustomerDto>.Fail("Not found")) : Ok(ApiEnvelope<CustomerDto>.Ok(ToDto(updated), "Status updated"));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct) => await service.DeleteAsync(id, ct) ? NoContent() : NotFound(ApiEnvelope<object>.Fail("Not found"));

    private static void Apply(Customer e, UpsertCustomerDto d) { e.Name=d.Name; e.Type=H.ParseEnum<ClientType>(d.Type); e.Phone=d.Phone; e.Email=d.Email; e.Address=d.Address; e.ContactPerson=d.ContactPerson; e.CompanyName=d.CompanyName; e.TaxNumber=d.TaxNumber; e.Status=H.ParseEnum<ClientStatus>(d.Status); }
    private static CustomerDto ToDto(Customer e) => new CustomerDto(e.Id,e.Name,e.Type.ToWire(),e.Phone,e.Email,e.Address,e.CompanyName,e.Status.ToWire(),e.CreatedAt);
    private static void SetStatus(Customer e, string status) {
        if (e is Booking booking) booking.Status = H.ParseEnum<BookingStatus>(status);
        else if (e is Trip trip) { trip.Status = H.ParseEnum<TripStatus>(status); if (trip.Status == TripStatus.InProgress) trip.ActualStart = DateTimeOffset.UtcNow; if (trip.Status == TripStatus.Completed) trip.ActualEnd = DateTimeOffset.UtcNow; }
        else if (e is Contract contract) contract.Status = H.ParseEnum<ContractStatus>(status);
        else if (e is Invoice invoice) invoice.Status = H.ParseEnum<InvoiceStatus>(status);
        else if (e is Vehicle vehicle) vehicle.Status = H.ParseEnum<VehicleStatus>(status);
        else if (e is Driver driver) driver.Status = H.ParseEnum<DriverStatus>(status);
    }
}
