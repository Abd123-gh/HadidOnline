using HadidOnline.Application.Common;
using HadidOnline.Application.DTOs;
using HadidOnline.Domain.Enums;
using HadidOnline.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HadidOnline.API.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/dashboard")]
public class DashboardController(HadidDbContext dbContext) : ControllerBase
{
    [HttpGet("stats")]
    public async Task<ActionResult<ApiEnvelope<DashboardStatsDto>>> Stats(CancellationToken ct)
    {
        var dto = new DashboardStatsDto(
            await dbContext.Bookings.CountAsync(ct),
            await dbContext.Contracts.CountAsync(ct),
            await dbContext.Vehicles.CountAsync(ct),
            await dbContext.Customers.CountAsync(ct),
            await dbContext.Vehicles.CountAsync(x => x.Status == VehicleStatus.Available, ct),
            await dbContext.Vehicles.CountAsync(x => x.Status == VehicleStatus.Busy, ct),
            await dbContext.Invoices.Where(x => x.Status == InvoiceStatus.Paid).SumAsync(x => x.TotalAmount, ct));
        return Ok(ApiEnvelope<DashboardStatsDto>.Ok(dto));
    }
}
