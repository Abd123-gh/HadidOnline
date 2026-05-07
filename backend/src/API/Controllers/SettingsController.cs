using HadidOnline.Application.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HadidOnline.API.Controllers;

[ApiController]
[Authorize(Roles = "SuperAdmin")]
[Route("api/v1/settings")]
public class SettingsController(IConfiguration configuration) : ControllerBase
{
    [HttpGet]
    public ActionResult<ApiEnvelope<object>> Get() => Ok(ApiEnvelope<object>.Ok(new { companyName = "Hadid Online", locale = "ar-SA", rtl = true, apiVersion = "v1", environment = configuration["ASPNETCORE_ENVIRONMENT"] ?? "Production" }));
}
