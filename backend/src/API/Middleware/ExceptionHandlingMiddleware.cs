using System.Net;
using FluentValidation;
using HadidOnline.Application.Common;
using System.Text.Json;

namespace HadidOnline.API.Middleware;

public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try { await next(context); }
        catch (ValidationException ex) { await WriteAsync(context, HttpStatusCode.BadRequest, "Validation failed", ex.Errors.GroupBy(e => e.PropertyName).ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray())); }
        catch (UnauthorizedAccessException ex) { await WriteAsync(context, HttpStatusCode.Unauthorized, ex.Message); }
        catch (KeyNotFoundException ex) { await WriteAsync(context, HttpStatusCode.NotFound, ex.Message); }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled API error");
            await WriteAsync(context, HttpStatusCode.InternalServerError, "Unexpected server error");
        }
    }

    private static async Task WriteAsync(HttpContext context, HttpStatusCode status, string message, IReadOnlyDictionary<string, string[]>? errors = null)
    {
        context.Response.StatusCode = (int)status;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonSerializer.Serialize(ApiEnvelope<object>.Fail(message, errors), new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }));
    }
}
