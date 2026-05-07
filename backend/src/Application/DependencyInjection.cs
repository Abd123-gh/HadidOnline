using FluentValidation;
using HadidOnline.Application.Interfaces;
using HadidOnline.Application.Mapping;
using HadidOnline.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace HadidOnline.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddAutoMapper(typeof(MappingProfile));
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);
        services.AddScoped(typeof(IEntityService<>), typeof(EntityService<>));
        return services;
    }
}
