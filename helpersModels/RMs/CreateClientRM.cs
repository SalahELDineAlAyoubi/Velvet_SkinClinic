using System.ComponentModel.DataAnnotations;

namespace VelvetSkinClinic.helpersModels.RMs
{
    public class CreateClientRM
    {
        [Required(ErrorMessage = "الرجاء إدخال الاسم")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "الاسم يجب أن يكون بين 2 و 100 حرف")]
        public string Name { get; set; }

        [Required(ErrorMessage = "الرجاء إدخال رقم الهوية")]
        [StringLength(50, ErrorMessage = "رقم الهوية يجب ألا يتجاوز 50 حرف")]
        public string ClientIdentifier { get; set; }

        [Required(ErrorMessage = "الرجاء إدخال رقم الهاتف")]
        [StringLength(20, ErrorMessage = "رقم الهاتف يجب ألا يتجاوز 20 حرف")]
        public string Phone { get; set; }

        [StringLength(20, ErrorMessage = "تاريخ الميلاد يجب ألا يتجاوز 20 حرف")]
        public string? Birthday { get; set; }

        [StringLength(500, ErrorMessage = "الأمراض يجب ألا تتجاوز 500 حرف")]
        public string? Diseases { get; set; }

        [StringLength(1000, ErrorMessage = "الملاحظات يجب ألا تتجاوز 1000 حرف")]
        public string? Notes { get; set; }

        [Range(0, 999999.99, ErrorMessage = "المبلغ المطلوب يجب أن يكون بين 0 و 999999.99")]
        public decimal TotalRequired { get; set; }

        public List<int> ServiceIds { get; set; } = new();
    }

}
