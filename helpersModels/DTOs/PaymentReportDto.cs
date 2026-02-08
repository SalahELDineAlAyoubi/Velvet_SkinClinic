using VelvetSkinClinic.helpersModels.Enums;

namespace VelvetSkinClinic.helpersModels.DTOs
{
    public class PaymentReportDto
    {
        public int Id { get; set; }
        public int ClientId { get; set; }
        public string ClientName { get; set; }
        public string ClientIdentifier { get; set; }
        public int PaymentNumber { get; set; }
        public decimal Amount { get; set; }
        public string Date { get; set; }  // YYYY-MM-DD format
    }
}
