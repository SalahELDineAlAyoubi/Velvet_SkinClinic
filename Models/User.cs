using System;
using System.Collections.Generic;

namespace VelvetSkinClinic.Models;

public partial class User
{
    public int Id { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public DateTime? DateOfBirth { get; set; }

    public string LoginCustom { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string PasswordSalt { get; set; } = null!;

    public int UserRole { get; set; }

    public DateTime? LastLoginDate { get; set; }

    public bool IsActif { get; set; }

    public string? MobileNumber { get; set; }

    public DateTime EntryDate { get; set; }
}
