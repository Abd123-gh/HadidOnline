using System.Text.Json.Serialization;

namespace HadidOnline.Client.Models;

public sealed record ApiEnvelope<T>(T? Data, bool Success, string? Message, IReadOnlyList<string>? Errors);
public sealed record PagedResult<T>(IReadOnlyList<T> Items, int PageNumber, int PageSize, int TotalCount);

public sealed class LoginRequest { public string Email { get; set; } = string.Empty; public string Password { get; set; } = string.Empty; public LoginRequest(){} public LoginRequest(string email,string password){Email=email;Password=password;} }
public sealed record RefreshRequest(string RefreshToken);
public sealed record AuthResponse(string AccessToken, string RefreshToken, string Email, string FullName, string Role, IReadOnlyList<string> Permissions);

public sealed record DashboardStats(int Bookings, int Contracts, int Vehicles, int Customers, int AvailableVehicles, int BusyVehicles, decimal Revenue);

public sealed record BookingDto(Guid Id, string BookingNumber, string ClientName, string ClientPhone, string? ClientEmail, string TripType, string ContractType, string Status, string PickupLocation, string Destination, DateOnly TripDate, TimeOnly TripTime, bool ReturnTrip, int Passengers, string? VehiclePreference, decimal? Price, string? Notes, DateTimeOffset CreatedAt);
public sealed class UpsertBookingDto
{
    public string ClientName { get; set; } = string.Empty; public string ClientPhone { get; set; } = string.Empty; public string? ClientEmail { get; set; }
    public string TripType { get; set; } = "private"; public string ContractType { get; set; } = "one_time"; public string PickupLocation { get; set; } = string.Empty; public string Destination { get; set; } = string.Empty;
    public DateOnly TripDate { get; set; } = DateOnly.FromDateTime(DateTime.Today.AddDays(1)); public TimeOnly TripTime { get; set; } = new(9, 0); public bool ReturnTrip { get; set; }
    public DateOnly? ReturnDate { get; set; } public TimeOnly? ReturnTime { get; set; } public int Passengers { get; set; } = 1; public Guid? VehicleId { get; set; } public Guid? DriverId { get; set; }
    public string? VehiclePreference { get; set; } public decimal? Price { get; set; } public string? Source { get; set; } = "admin"; public string? Notes { get; set; }
    public UpsertBookingDto() { }
    public UpsertBookingDto(string clientName, string clientPhone, string? clientEmail, string tripType, string contractType, string pickupLocation, string destination, DateOnly tripDate, TimeOnly tripTime, bool returnTrip, DateOnly? returnDate, TimeOnly? returnTime, int passengers, Guid? vehicleId, Guid? driverId, string? vehiclePreference, decimal? price, string? source, string? notes) { ClientName=clientName; ClientPhone=clientPhone; ClientEmail=clientEmail; TripType=tripType; ContractType=contractType; PickupLocation=pickupLocation; Destination=destination; TripDate=tripDate; TripTime=tripTime; ReturnTrip=returnTrip; ReturnDate=returnDate; ReturnTime=returnTime; Passengers=passengers; VehicleId=vehicleId; DriverId=driverId; VehiclePreference=vehiclePreference; Price=price; Source=source; Notes=notes; }
}

public sealed record VehicleDto(Guid Id, string Name, string Type, string PlateNumber, int Capacity, string? Model, int? Year, bool HasAc, bool HasWifi, bool HasLuggageSpace, string ComfortLevel, string Status, string? ImageUrl, string? Notes, DateOnly? LastMaintenanceDate, DateOnly? NextMaintenanceDate, DateTimeOffset CreatedAt);
public sealed class UpsertVehicleDto
{
    public string Name { get; set; } = string.Empty; public string Type { get; set; } = "bus"; public string PlateNumber { get; set; } = string.Empty; public int Capacity { get; set; } = 45; public string? Model { get; set; } public int? Year { get; set; } = 2026;
    public bool HasAc { get; set; } = true; public bool HasWifi { get; set; } = true; public bool HasLuggageSpace { get; set; } = true; public string ComfortLevel { get; set; } = "business"; public string Status { get; set; } = "available"; public string? ImageUrl { get; set; } public string? Notes { get; set; } public DateOnly? LastMaintenanceDate { get; set; } public DateOnly? NextMaintenanceDate { get; set; }
    public UpsertVehicleDto() { }
    public UpsertVehicleDto(string name,string type,string plateNumber,int capacity,string? model,int? year,bool hasAc,bool hasWifi,bool hasLuggageSpace,string comfortLevel,string status,string? imageUrl,string? notes,DateOnly? lastMaintenanceDate,DateOnly? nextMaintenanceDate){Name=name;Type=type;PlateNumber=plateNumber;Capacity=capacity;Model=model;Year=year;HasAc=hasAc;HasWifi=hasWifi;HasLuggageSpace=hasLuggageSpace;ComfortLevel=comfortLevel;Status=status;ImageUrl=imageUrl;Notes=notes;LastMaintenanceDate=lastMaintenanceDate;NextMaintenanceDate=nextMaintenanceDate;}
}

public sealed record DriverDto(Guid Id, string FullName, string Phone, string? Email, string LicenseNumber, DateOnly LicenseExpiry, string Status, decimal Rating, int TotalTrips, string? Notes, DateTimeOffset CreatedAt);
public sealed class UpsertDriverDto { public string FullName { get; set; } = string.Empty; public string Phone { get; set; } = string.Empty; public string? Email { get; set; } public string LicenseNumber { get; set; } = string.Empty; public DateOnly LicenseExpiry { get; set; } = DateOnly.FromDateTime(DateTime.Today.AddYears(1)); public string? NationalId { get; set; } public string Status { get; set; } = "available"; public decimal Rating { get; set; } = 5; public int TotalTrips { get; set; } public string? Notes { get; set; } public UpsertDriverDto(){} public UpsertDriverDto(string fullName,string phone,string? email,string licenseNumber,DateOnly licenseExpiry,string? nationalId,string status,decimal rating,int totalTrips,string? notes){FullName=fullName;Phone=phone;Email=email;LicenseNumber=licenseNumber;LicenseExpiry=licenseExpiry;NationalId=nationalId;Status=status;Rating=rating;TotalTrips=totalTrips;Notes=notes;} }

public sealed record CustomerDto(Guid Id, string Name, string Type, string Phone, string? Email, string? Address, string? CompanyName, string Status, DateTimeOffset CreatedAt);
public sealed class UpsertCustomerDto { public string Name { get; set; } = string.Empty; public string Type { get; set; } = "individual"; public string Phone { get; set; } = string.Empty; public string? Email { get; set; } public string? Address { get; set; } public string? ContactPerson { get; set; } public string? CompanyName { get; set; } public string? TaxNumber { get; set; } public string Status { get; set; } = "active"; public UpsertCustomerDto(){} public UpsertCustomerDto(string name,string type,string phone,string? email,string? address,string? contactPerson,string? companyName,string? taxNumber,string status){Name=name;Type=type;Phone=phone;Email=email;Address=address;ContactPerson=contactPerson;CompanyName=companyName;TaxNumber=taxNumber;Status=status;} }

public sealed record ContractDto(Guid Id, string ContractNumber, Guid? CustomerId, string Type, string Status, DateOnly? StartDate, DateOnly? EndDate, decimal? MonthlyAmount, decimal? TotalAmount, string BillingCycle, string? Notes, DateTimeOffset CreatedAt);
public sealed class UpsertContractDto { public Guid? CustomerId { get; set; } public Guid? CompanyId { get; set; } public string Type { get; set; } = "corporate"; public string Status { get; set; } = "new"; public DateOnly? StartDate { get; set; } public DateOnly? EndDate { get; set; } public decimal? MonthlyAmount { get; set; } public decimal? TotalAmount { get; set; } public string BillingCycle { get; set; } = "monthly"; public string? Terms { get; set; } public string? Notes { get; set; } public UpsertContractDto(){} public UpsertContractDto(Guid? customerId,Guid? companyId,string type,string status,DateOnly? startDate,DateOnly? endDate,decimal? monthlyAmount,decimal? totalAmount,string billingCycle,string? terms,string? notes){CustomerId=customerId;CompanyId=companyId;Type=type;Status=status;StartDate=startDate;EndDate=endDate;MonthlyAmount=monthlyAmount;TotalAmount=totalAmount;BillingCycle=billingCycle;Terms=terms;Notes=notes;} }

public sealed record TripDto(Guid Id, Guid? BookingId, Guid? VehicleId, Guid? DriverId, string Status, string PickupLocation, string Destination, DateOnly ScheduledDate, TimeOnly ScheduledTime, DateTimeOffset? ActualStart, DateTimeOffset? ActualEnd, string? Notes, DateTimeOffset CreatedAt);
public sealed class UpsertTripDto { public Guid? BookingId { get; set; } public Guid? ContractId { get; set; } public Guid? VehicleId { get; set; } public Guid? DriverId { get; set; } public Guid? RouteId { get; set; } public string Status { get; set; } = "scheduled"; public DateOnly ScheduledDate { get; set; } = DateOnly.FromDateTime(DateTime.Today.AddDays(1)); public TimeOnly ScheduledTime { get; set; } = new(9,0); public DateTimeOffset? ActualStart { get; set; } public DateTimeOffset? ActualEnd { get; set; } public string PickupLocation { get; set; } = string.Empty; public string Destination { get; set; } = string.Empty; public int Passengers { get; set; } = 1; public string? Notes { get; set; } public UpsertTripDto(){} public UpsertTripDto(Guid? bookingId,Guid? contractId,Guid? vehicleId,Guid? driverId,Guid? routeId,string status,DateOnly scheduledDate,TimeOnly scheduledTime,DateTimeOffset? actualStart,DateTimeOffset? actualEnd,string pickupLocation,string destination,int passengers,string? notes){BookingId=bookingId;ContractId=contractId;VehicleId=vehicleId;DriverId=driverId;RouteId=routeId;Status=status;ScheduledDate=scheduledDate;ScheduledTime=scheduledTime;ActualStart=actualStart;ActualEnd=actualEnd;PickupLocation=pickupLocation;Destination=destination;Passengers=passengers;Notes=notes;} }

public sealed record InvoiceDto(Guid Id, string InvoiceNumber, Guid? CustomerId, decimal Amount, decimal TaxAmount, decimal TotalAmount, string Status, DateOnly? DueDate, DateOnly? PaidDate, DateTimeOffset CreatedAt);
public sealed class UpsertInvoiceDto { public Guid? CustomerId { get; set; } public Guid? BookingId { get; set; } public Guid? ContractId { get; set; } public decimal Amount { get; set; } public decimal TaxAmount { get; set; } public decimal TotalAmount { get; set; } public string Status { get; set; } = "pending"; public DateOnly? DueDate { get; set; } public DateOnly? PaidDate { get; set; } public string? PaymentMethod { get; set; } public string? Notes { get; set; } public UpsertInvoiceDto(){} public UpsertInvoiceDto(Guid? customerId,Guid? bookingId,Guid? contractId,decimal amount,decimal taxAmount,decimal totalAmount,string status,DateOnly? dueDate,DateOnly? paidDate,string? paymentMethod,string? notes){CustomerId=customerId;BookingId=bookingId;ContractId=contractId;Amount=amount;TaxAmount=taxAmount;TotalAmount=totalAmount;Status=status;DueDate=dueDate;PaidDate=paidDate;PaymentMethod=paymentMethod;Notes=notes;} }

public sealed record TourPackageDto(Guid Id, string Name, string NameAr, string? Description, string? DescriptionAr, string Destination, int DurationDays, decimal? PricePerPerson, int MinPassengers, int MaxPassengers, string? ImageUrl, bool IsActive, DateTimeOffset CreatedAt);
public sealed record UpdateStatusDto(string Status);

public sealed class BookingFormModel
{
    public string ClientName { get; set; } = string.Empty;
    public string ClientPhone { get; set; } = string.Empty;
    public string? ClientEmail { get; set; }
    public string TripType { get; set; } = "tourist";
    public string ContractType { get; set; } = "one_time";
    public DateOnly TripDate { get; set; } = DateOnly.FromDateTime(DateTime.Today.AddDays(1));
    public TimeOnly TripTime { get; set; } = new(9, 0);
    public int Passengers { get; set; } = 1;
    public string PickupLocation { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public bool ReturnTrip { get; set; }
    public DateOnly? ReturnDate { get; set; }
    public string? VehiclePreference { get; set; }
    public string? Notes { get; set; }
}
