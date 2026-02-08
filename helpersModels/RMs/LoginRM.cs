using System.ComponentModel.DataAnnotations;

namespace VelvetSkinClinic.helpersModels.RMs
{
    public class LoginRM
    {
        [Required]
        public string LoginCustom { get; set; }

        [Required]
        public string Password { get; set; }
    }
}