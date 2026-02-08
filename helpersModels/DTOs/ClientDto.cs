using VelvetSkinClinic.helpersModels.Enums;

namespace VelvetSkinClinic.helpersModels.DTOs
{
    public class PaymentDto
    {
        public int Id { get; set; }
        public int PaymentNumber { get; set; }
        public decimal Amount { get; set; }
        public string Date { get; set; }   
    }
}
