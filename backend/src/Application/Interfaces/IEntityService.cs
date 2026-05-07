using HadidOnline.Application.Common;
using HadidOnline.Domain.Common;

namespace HadidOnline.Application.Interfaces;

public interface IEntityService<TEntity> where TEntity : BaseEntity
{
    Task<PagedResult<TEntity>> ListAsync(QueryParameters query, CancellationToken cancellationToken = default);
    Task<TEntity?> GetAsync(Guid id, CancellationToken cancellationToken = default);
    Task<TEntity> CreateAsync(TEntity entity, CancellationToken cancellationToken = default);
    Task<TEntity?> UpdateAsync(Guid id, Action<TEntity> apply, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
