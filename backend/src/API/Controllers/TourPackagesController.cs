using HadidOnline.Application.Common;
using HadidOnline.Application.DTOs;
using HadidOnline.Application.Interfaces;
using HadidOnline.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace HadidOnline.API.Controllers;

[ApiController]
[Route("api/v1/tour-packages")]
public class TourPackagesController(IEntityService<TourPackage> service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiEnvelope<PagedResult<TourPackageDto>>>> List([FromQuery] bool activeOnly = false, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 25, CancellationToken ct = default)
    {
        var result = await service.ListAsync(new QueryParameters(pageNumber, pageSize), ct);
        var items = result.Items.Where(x => !activeOnly || x.IsActive).Select(x => new TourPackageDto(x.Id,x.Name,x.NameAr,x.Description,x.DescriptionAr,x.Destination,x.DurationDays,x.PricePerPerson,x.MinPassengers,x.MaxPassengers,x.ImageUrl,x.IsActive,x.CreatedAt)).ToList();
        return Ok(ApiEnvelope<PagedResult<TourPackageDto>>.Ok(new PagedResult<TourPackageDto>(items, result.PageNumber, result.PageSize, result.TotalCount)));
    }
}
