using System.ComponentModel.DataAnnotations;

namespace VelvetSkinClinic.helpersModels.RMs
{
    public class UpdateServiceRM
    {
        [Required(ErrorMessage = "الرجاء إدخال اسم الخدمة")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "اسم الخدمة يجب أن يكون بين 2 و 100 حرف")]
        public string Name { get; set; }

        [StringLength(500, ErrorMessage = "الوصف يجب ألا يتجاوز 500 حرف")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "الرجاء إدخال السعر")]
        [Range(0.01, 999999.99, ErrorMessage = "السعر يجب أن يكون أكبر من صفر")]
        public decimal Price { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "عدد الجلسات يجب أن يكون صفر أو أكثر")]
        public int SessionsNumber { get; set; }
    }

}
