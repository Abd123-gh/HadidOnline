using HadidOnline.Domain.Common;
using HadidOnline.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HadidOnline.Infrastructure.Data;

public class HadidDbContext(DbContextOptions<HadidDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Company> Companies => Set<Company>();
    public DbSet<School> Schools => Set<School>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<Trip> Trips => Set<Trip>();
    public DbSet<RouteEntity> Routes => Set<RouteEntity>();
    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
    public DbSet<Fleet> Fleets => Set<Fleet>();
    public DbSet<Driver> Drivers => Set<Driver>();
    public DbSet<Contract> Contracts => Set<Contract>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<MaintenanceRecord> MaintenanceRecords => Set<MaintenanceRecord>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<ActivityLog> ActivityLogs => Set<ActivityLog>();
    public DbSet<TourPackage> TourPackages => Set<TourPackage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.HasDefaultSchema("hadid");
        foreach (var entityType in modelBuilder.Model.GetEntityTypes().Where(t => typeof(BaseEntity).IsAssignableFrom(t.ClrType)))
        {
            modelBuilder.Entity(entityType.ClrType).HasQueryFilter(BuildSoftDeleteFilter(entityType.ClrType));
        }

        modelBuilder.Entity<User>().HasIndex(x => x.Email).IsUnique();
        modelBuilder.Entity<Role>().HasIndex(x => x.Name).IsUnique();
        modelBuilder.Entity<Permission>().HasIndex(x => x.Key).IsUnique();
        modelBuilder.Entity<Vehicle>().HasIndex(x => x.PlateNumber).IsUnique();
        modelBuilder.Entity<Driver>().HasIndex(x => x.LicenseNumber).IsUnique();
        modelBuilder.Entity<Booking>().HasIndex(x => x.BookingNumber).IsUnique();
        modelBuilder.Entity<Contract>().HasIndex(x => x.ContractNumber).IsUnique();
        modelBuilder.Entity<Invoice>().HasIndex(x => x.InvoiceNumber).IsUnique();
        modelBuilder.Entity<Booking>().HasIndex(x => new { x.TripDate, x.Status });
        modelBuilder.Entity<Trip>().HasIndex(x => new { x.ScheduledDate, x.Status });
        modelBuilder.Entity<Invoice>().HasIndex(x => x.Status);


        modelBuilder.Entity<Trip>()
            .HasOne(x => x.Route)
            .WithMany()
            .HasForeignKey(x => x.RouteId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<RouteEntity>()
            .ToTable("Routes");

        modelBuilder.Entity<Role>().HasData(
            new Role { Id = Guid.Parse("10000000-0000-0000-0000-000000000001"), Name = "SuperAdmin", Description = "Full system access" },
            new Role { Id = Guid.Parse("10000000-0000-0000-0000-000000000002"), Name = "Sales", Description = "Sales and contracts" },
            new Role { Id = Guid.Parse("10000000-0000-0000-0000-000000000003"), Name = "Dispatcher", Description = "Trips and fleet operations" },
            new Role { Id = Guid.Parse("10000000-0000-0000-0000-000000000004"), Name = "Driver", Description = "Driver mobile access" });
        modelBuilder.Entity<User>().HasData(new User { Id = Guid.Parse("20000000-0000-0000-0000-000000000001"), FullName = "Hadid Super Admin", Email = "admin@hadid.online", PasswordHash = "$2a$11$Yrr9FqkE4p3l0VJvBqT4dO71fDqigLbphuD1nJpHbFS8P5Zk9l7b6", RoleId = Guid.Parse("10000000-0000-0000-0000-000000000001") });
    }

    private static System.Linq.Expressions.LambdaExpression BuildSoftDeleteFilter(Type type)
    {
        var parameter = System.Linq.Expressions.Expression.Parameter(type, "e");
        var property = System.Linq.Expressions.Expression.Property(parameter, nameof(BaseEntity.IsDeleted));
        var compare = System.Linq.Expressions.Expression.Equal(property, System.Linq.Expressions.Expression.Constant(false));
        return System.Linq.Expressions.Expression.Lambda(compare, parameter);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Modified) entry.Entity.UpdatedAt = DateTimeOffset.UtcNow;
            if (entry.State == EntityState.Deleted)
            {
                entry.State = EntityState.Modified;
                entry.Entity.IsDeleted = true;
                entry.Entity.DeletedAt = DateTimeOffset.UtcNow;
            }
        }
        return base.SaveChangesAsync(cancellationToken);
    }
}
