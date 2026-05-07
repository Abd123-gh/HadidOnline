using HadidOnline.Application.Common;
using HadidOnline.Application.Interfaces;
using HadidOnline.Domain.Common;
using HadidOnline.Domain.Interfaces;

namespace HadidOnline.Application.Services;

public class EntityService<TEntity>(IRepository<TEntity> repository) : IEntityService<TEntity> where TEntity : BaseEntity
{
    public async Task<PagedResult<TEntity>> ListAsync(QueryParameters query, CancellationToken cancellationToken = default)
    {
        var page = Math.Max(1, query.PageNumber);
        var size = Math.Clamp(query.PageSize, 1, 100);
        var items = await repository.ListAsync(page, size, query.Search, cancellationToken);
        var total = await repository.CountAsync(query.Search, cancellationToken);
        return new PagedResult<TEntity>(items, page, size, total);
    }

    public Task<TEntity?> GetAsync(Guid id, CancellationToken cancellationToken = default) => repository.GetByIdAsync(id, cancellationToken);

    public Task<TEntity> CreateAsync(TEntity entity, CancellationToken cancellationToken = default) => repository.AddAsync(entity, cancellationToken);

    public async Task<TEntity?> UpdateAsync(Guid id, Action<TEntity> apply, CancellationToken cancellationToken = default)
    {
        var entity = await repository.GetByIdAsync(id, cancellationToken);
        if (entity is null) return null;
        apply(entity);
        entity.UpdatedAt = DateTimeOffset.UtcNow;
        await repository.UpdateAsync(entity, cancellationToken);
        return entity;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await repository.GetByIdAsync(id, cancellationToken);
        if (entity is null) return false;
        await repository.DeleteAsync(entity, cancellationToken);
        return true;
    }
}
