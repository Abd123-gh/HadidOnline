using HadidOnline.Domain.Common;
using HadidOnline.Domain.Interfaces;
using HadidOnline.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace HadidOnline.Infrastructure.Repositories;

public class EfRepository<T>(HadidDbContext dbContext) : IRepository<T> where T : BaseEntity
{
    public Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) => dbContext.Set<T>().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task<IReadOnlyList<T>> ListAsync(int pageNumber = 1, int pageSize = 25, string? search = null, CancellationToken cancellationToken = default)
    {
        return await dbContext.Set<T>().AsNoTracking().OrderByDescending(x => x.CreatedAt).Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);
    }

    public Task<int> CountAsync(string? search = null, CancellationToken cancellationToken = default) => dbContext.Set<T>().CountAsync(cancellationToken);

    public async Task<T> AddAsync(T entity, CancellationToken cancellationToken = default)
    {
        dbContext.Set<T>().Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task UpdateAsync(T entity, CancellationToken cancellationToken = default)
    {
        dbContext.Set<T>().Update(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(T entity, CancellationToken cancellationToken = default)
    {
        dbContext.Set<T>().Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
