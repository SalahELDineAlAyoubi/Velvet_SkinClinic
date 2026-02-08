using VelvetSkinClinic.helpersModels.Enums;

namespace VelvetSkinClinic.helpersModels.DTOs
{
    public class ClientListDto
    {
        public int Id { get; set; }
        public string ClientIdentifier { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
    }
}
