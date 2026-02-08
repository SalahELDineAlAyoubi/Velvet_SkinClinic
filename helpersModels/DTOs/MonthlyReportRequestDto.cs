using VelvetSkinClinic.helpersModels.Enums;

namespace VelvetSkinClinic.helpersModels.DTOs
{
    public class MonthlyReportRequestDto
    {
        public int? Year { get; set; }
        public int? Month { get; set; }  // 1-12
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
