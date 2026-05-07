using HadidOnline.Domain.Common;

namespace HadidOnline.Domain.Interfaces;

public interface IRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<T>> ListAsync(int pageNumber = 1, int pageSize = 25, string? search = null, CancellationToken cancellationToken = default);
    Task<int> CountAsync(string? search = null, CancellationToken cancellationToken = default);
    Task<T> AddAsync(T entity, CancellationToken cancellationToken = default);
    Task UpdateAsync(T entity, CancellationToken cancellationToken = default);
    Task DeleteAsync(T entity, CancellationToken cancellationToken = default);
}
