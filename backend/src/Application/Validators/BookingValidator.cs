using FluentValidation;
using HadidOnline.Application.DTOs;

namespace HadidOnline.Application.Validators;

public class UpsertBookingDtoValidator : AbstractValidator<UpsertBookingDto>
{
    public UpsertBookingDtoValidator()
    {
        RuleFor(x => x.ClientName).NotEmpty().MaximumLength(200);
        RuleFor(x => x.ClientPhone).NotEmpty().MaximumLength(40);
        RuleFor(x => x.TripType).NotEmpty();
        RuleFor(x => x.PickupLocation).NotEmpty().MaximumLength(500);
        RuleFor(x => x.Destination).NotEmpty().MaximumLength(500);
        RuleFor(x => x.Passengers).GreaterThan(0).LessThanOrEqualTo(100);
    }
}

public class LoginRequestDtoValidator : AbstractValidator<LoginRequestDto>
{
    public LoginRequestDtoValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(8);
    }
}
