using VelvetSkinClinic.helpersModels.Enums;

namespace VelvetSkinClinic.helpersModels.DTOs
{
    public class MonthlyReportDto
    {
        public string Period { get; set; }   
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public decimal TotalAmount { get; set; }
        public int TotalPayments { get; set; }
        public int UniqueClients { get; set; }
        public List<PaymentReportDto> Payments { get; set; } = new();
    }

}
