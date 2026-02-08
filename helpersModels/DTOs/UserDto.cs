namespace VelvetSkinClinic.helpersModels.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string LoginCustom { get; set; }
        public int UserRole { get; set; }
        public DateTime? LastLoginDate { get; set; }
        public bool IsActif { get; set; }
        public string MobileNumber { get; set; }
        public DateTime EntryDate { get; set; }
    }
}
