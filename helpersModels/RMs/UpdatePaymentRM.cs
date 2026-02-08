using System.ComponentModel.DataAnnotations;

namespace VelvetSkinClinic.helpersModels.RMs
{
    public class UpdatePaymentRM
    {
        [Required(ErrorMessage = "الرجاء إدخال المبلغ")]
        [Range(0.01, 999999.99, ErrorMessage = "المبلغ يجب أن يكون بين 0.01 و 999999.99")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "الرجاء إدخال التاريخ")]
        public string Date { get; set; }  // YYYY-MM-DD format
    }


}
