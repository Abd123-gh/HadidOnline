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
[Route("api/v1/contracts")]
[Authorize]
public class ContractsController(IEntityService<Contract> service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiEnvelope<PagedResult<ContractDto>>>> List([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 25, [FromQuery] string? search = null, CancellationToken ct = default)
    {
        var result = await service.ListAsync(new QueryParameters(pageNumber, pageSize, search), ct);
        return Ok(ApiEnvelope<PagedResult<ContractDto>>.Ok(new PagedResult<ContractDto>(result.Items.Select(ToDto).ToList(), result.PageNumber, result.PageSize, result.TotalCount)));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiEnvelope<ContractDto>>> Get(Guid id, CancellationToken ct)
    {
        var entity = await service.GetAsync(id, ct);
        return entity is null ? NotFound(ApiEnvelope<ContractDto>.Fail("Not found")) : Ok(ApiEnvelope<ContractDto>.Ok(ToDto(entity)));
    }

    [HttpPost]
    public async Task<ActionResult<ApiEnvelope<ContractDto>>> Create(UpsertContractDto request, CancellationToken ct)
    {
        var entity = new Contract(); Apply(entity, request);
        entity = await service.CreateAsync(entity, ct);
        return CreatedAtAction(nameof(Get), new { id = entity.Id }, ApiEnvelope<ContractDto>.Ok(ToDto(entity), "Created"));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiEnvelope<ContractDto>>> Update(Guid id, UpsertContractDto request, CancellationToken ct)
    {
        var updated = await service.UpdateAsync(id, e => Apply(e, request), ct);
        return updated is null ? NotFound(ApiEnvelope<ContractDto>.Fail("Not found")) : Ok(ApiEnvelope<ContractDto>.Ok(ToDto(updated), "Updated"));
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult<ApiEnvelope<ContractDto>>> UpdateStatus(Guid id, UpdateStatusDto request, CancellationToken ct)
    {
        var updated = await service.UpdateAsync(id, e => SetStatus(e, request.Status), ct);
        return updated is null ? NotFound(ApiEnvelope<ContractDto>.Fail("Not found")) : Ok(ApiEnvelope<ContractDto>.Ok(ToDto(updated), "Status updated"));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct) => await service.DeleteAsync(id, ct) ? NoContent() : NotFound(ApiEnvelope<object>.Fail("Not found"));

    private static void Apply(Contract e, UpsertContractDto d) { e.ContractNumber = string.IsNullOrWhiteSpace(e.ContractNumber) ? $"CT-{DateTime.UtcNow:yyyy}-{Random.Shared.Next(10000,99999)}" : e.ContractNumber; e.CustomerId=d.CustomerId; e.CompanyId=d.CompanyId; e.Type=H.ParseEnum<ContractType>(d.Type); e.Status=H.ParseEnum<ContractStatus>(d.Status); e.StartDate=d.StartDate; e.EndDate=d.EndDate; e.MonthlyAmount=d.MonthlyAmount; e.TotalAmount=d.TotalAmount; e.BillingCycle=H.ParseEnum<ContractBillingCycle>(d.BillingCycle); e.Terms=d.Terms; e.Notes=d.Notes; }
    private static ContractDto ToDto(Contract e) => new ContractDto(e.Id,e.ContractNumber,e.CustomerId,e.Type.ToWire(),e.Status.ToWire(),e.StartDate,e.EndDate,e.MonthlyAmount,e.TotalAmount,e.BillingCycle.ToWire(),e.Notes,e.CreatedAt);
    private static void SetStatus(Contract e, string status) => e.Status = H.ParseEnum<ContractStatus>(status);
}
