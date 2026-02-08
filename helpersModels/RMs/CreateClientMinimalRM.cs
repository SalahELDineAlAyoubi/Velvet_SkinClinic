using System.ComponentModel.DataAnnotations;

namespace VelvetSkinClinic.helpersModels.RMs
{
    public class CreateClientMinimalRM
    {
        [Required(ErrorMessage = "الرجاء إدخال الاسم")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "الاسم يجب أن يكون بين 3 و 100 حرف")]
        public string Name { get; set; }

        [Required(ErrorMessage = "الرجاء إدخال رقم الهاتف")]
        [StringLength(20, ErrorMessage = "رقم الهاتف يجب ألا يتجاوز 20 حرف")]
        public string Phone { get; set; }
    }

}
