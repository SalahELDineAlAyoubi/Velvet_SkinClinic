using System;
using System.Collections.Generic;

namespace VelvetSkinClinic.Models;

public partial class Client
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string ClientIdentifier { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public string? Birthday { get; set; }

    public string? Diseases { get; set; }

    public string? Notes { get; set; }

    public decimal TotalRequired { get; set; }

    public decimal TotalPaid { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public virtual ICollection<ClientService> ClientServices { get; set; } = new List<ClientService>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
