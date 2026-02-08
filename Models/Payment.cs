using System;
using System.Collections.Generic;

namespace VelvetSkinClinic.Models;

public partial class Payment
{
    public int Id { get; set; }

    public int ClientId { get; set; }

    public int PaymentNumber { get; set; }

    public decimal Amount { get; set; }

    public DateOnly PaymentDate { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public virtual Client Client { get; set; } = null!;
}
