namespace HadidOnline.Domain.Enums;

public enum UserStatus { Active, Locked, Inactive }
public enum ClientType { Individual, Corporate, School }
public enum ClientStatus { Active, Inactive, Suspended }
public enum VehicleType { Bus, Van, Minibus }
public enum ComfortLevel { Standard, Business, Vip }
public enum VehicleStatus { Available, Busy, Maintenance, OutOfService }
public enum DriverStatus { Available, OnTrip, OffDuty, Inactive }
public enum BookingTripType { Tourist, Corporate, School, Private }
public enum ContractType { Corporate, School, Tourist }
public enum ContractBillingCycle { OneTime, Monthly, Yearly, Recurring }
public enum BookingStatus { New, Confirmed, Assigned, InProgress, Completed, Cancelled }
public enum TripStatus { Scheduled, InProgress, Completed, Cancelled }
public enum ContractStatus { New, Negotiating, Active, Expired, Cancelled }
public enum InvoiceStatus { Pending, Paid, Overdue, Cancelled }
public enum PaymentStatus { Pending, Completed, Failed, Refunded }
public enum MaintenanceStatus { Planned, InProgress, Completed, Cancelled }
public enum NotificationStatus { Unread, Read, Archived }
