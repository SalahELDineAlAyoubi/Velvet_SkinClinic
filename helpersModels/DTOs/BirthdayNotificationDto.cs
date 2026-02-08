using VelvetSkinClinic.helpersModels.Enums;

namespace VelvetSkinClinic.helpersModels.DTOs
{
    public class BirthdayNotificationDto
    {
        public int Id { get; set; }
        public string ClientIdentifier { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Birthday { get; set; }  // DD/MM/YYYY or DD/MM
        public int DaysUntilBirthday { get; set; }
        public bool IsToday { get; set; }
    }
}
