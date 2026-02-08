using System.ComponentModel.DataAnnotations;

namespace VelvetSkinClinic.helpersModels.RMs
{
    public class CreatePaymentRM
    {
        [Required(ErrorMessage = "الرجاء إدخال المبلغ")]
        [Range(0.01, 999999.99, ErrorMessage = "المبلغ يجب أن يكون بين 0.01 و 999999.99")]
        public decimal Amount { get; set; }
    }


}
