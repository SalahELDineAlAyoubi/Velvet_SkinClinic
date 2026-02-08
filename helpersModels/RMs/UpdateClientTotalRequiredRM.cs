using System.ComponentModel.DataAnnotations;

namespace VelvetSkinClinic.helpersModels.RMs
{
    public class UpdateClientTotalRequiredRM
    {
        [Range(0, 999999.99, ErrorMessage = "المبلغ المطلوب يجب أن يكون بين 0 و 999999.99")]
        public decimal TotalRequired { get; set; }
    }

}
