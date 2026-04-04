using System.ComponentModel.DataAnnotations;
using VelvetSkinClinic.helpersModels.Enums;

namespace VelvetSkinClinic.helpersModels.RMs
{
    public class ChangePasswordRM
    {
        [Required]
        public string Login { get; set; }

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; }
    }
}
