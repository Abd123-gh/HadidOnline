using HadidOnline.Domain.Enums;

namespace HadidOnline.API.Controllers;

internal static class ControllerHelpers
{
    public static TEnum ParseEnum<TEnum>(string value) where TEnum : struct, Enum
    {
        var normalized = value.Replace("_", string.Empty).Replace("-", string.Empty);
        foreach (var name in Enum.GetNames<TEnum>())
            if (string.Equals(name, normalized, StringComparison.OrdinalIgnoreCase)) return Enum.Parse<TEnum>(name);
        return Enum.Parse<TEnum>(value, true);
    }

    public static string ToWire(this Enum value)
    {
        var text = value.ToString();
        return string.Concat(text.Select((c, i) => i > 0 && char.IsUpper(c) ? "_" + char.ToLowerInvariant(c) : char.ToLowerInvariant(c).ToString()));
    }
}
