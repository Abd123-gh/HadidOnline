using HadidOnline.Application.Common;
using HadidOnline.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HadidOnline.API.Controllers;

[ApiController]
[Authorize(Roles = "SuperAdmin,Sales")]
[Route("api/v1/reports")]
public class ReportsController(HadidDbContext dbContext) : ControllerBase
{
    [HttpGet("summary")]
    public async Task<ActionResult<ApiEnvelope<object>>> Summary(CancellationToken ct)
    {
        var data = new {
            bookings = await dbContext.Bookings.CountAsync(ct),
            vehicles = await dbContext.Vehicles.CountAsync(ct),
            customers = await dbContext.Customers.CountAsync(ct),
            contracts = await dbContext.Contracts.CountAsync(ct),
            revenue = await dbContext.Invoices.SumAsync(x => x.TotalAmount, ct)
        };
        return Ok(ApiEnvelope<object>.Ok(data));
    }
}
