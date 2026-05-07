using AutoMapper;
using HadidOnline.Application.DTOs;
using HadidOnline.Domain.Entities;

namespace HadidOnline.Application.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Vehicle, VehicleDto>();
        CreateMap<Driver, DriverDto>();
        CreateMap<Customer, CustomerDto>();
        CreateMap<Booking, BookingDto>();
        CreateMap<Trip, TripDto>();
        CreateMap<Contract, ContractDto>();
        CreateMap<Invoice, InvoiceDto>();
        CreateMap<Route, RouteDto>();
        CreateMap<TourPackage, TourPackageDto>();
        CreateMap<Notification, NotificationDto>();
    }
}
