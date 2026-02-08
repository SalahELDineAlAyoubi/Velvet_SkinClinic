using System.ComponentModel.DataAnnotations;

namespace VelvetSkinClinic.helpersModels.RMs
{
    public class CreateUserRM
    {
        [Required]
        [StringLength(100)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(100)]
        public string LastName { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [Required]
        [StringLength(50)]
        public string LoginCustom { get; set; }

        [Required]
        //[MinLength(6)]
        public string Password { get; set; }

        [Required]
        public int UserRole { get; set; }

        [Phone]
        public string MobileNumber { get; set; }
    }
}
