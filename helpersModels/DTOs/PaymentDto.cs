using VelvetSkinClinic.helpersModels.Enums;

namespace VelvetSkinClinic.helpersModels.DTOs
{
    public class ClientDto
    {
        public int Id { get; set; }
        public string ClientIdentifier { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string? Birthday { get; set; }
        public string? Diseases { get; set; }
        public string? Notes { get; set; }
        public List<ServiceDto> Services { get; set; } = new();
        public decimal TotalRequired { get; set; }
        public decimal TotalPaid { get; set; }
        public decimal RemainingAmount => TotalRequired - TotalPaid;
        public List<PaymentDto> Payments { get; set; } = new();
    }
}
