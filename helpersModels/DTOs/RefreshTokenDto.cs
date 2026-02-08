using VelvetSkinClinic.helpersModels.Enums;

namespace VelvetSkinClinic.helpersModels.DTOs
{
    public class TokenResponseDto
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public DateTime Expiration { get; set; }
    }
}
