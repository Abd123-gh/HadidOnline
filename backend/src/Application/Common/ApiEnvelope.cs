namespace HadidOnline.Application.Common;

public record ApiEnvelope<T>(bool Success, T? Data, string? Message = null, IReadOnlyDictionary<string, string[]>? Errors = null)
{
    public static ApiEnvelope<T> Ok(T data, string? message = null) => new(true, data, message);
    public static ApiEnvelope<T> Fail(string message, IReadOnlyDictionary<string, string[]>? errors = null) => new(false, default, message, errors);
}

public record PagedResult<T>(IReadOnlyList<T> Items, int PageNumber, int PageSize, int TotalCount)
{
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
}

public record QueryParameters(int PageNumber = 1, int PageSize = 25, string? Search = null);
