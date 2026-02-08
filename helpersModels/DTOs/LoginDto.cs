using VelvetSkinClinic.helpersModels.Enums;

namespace VelvetSkinClinic.helpersModels.DTOs
{
    public class LoginDto
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string LoginCustom { get; set; }
        public UserRoleEnum UserRole { get; set; }
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public DateTime TokenExpiration { get; set; }
    }
}
