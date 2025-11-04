namespace LabAdmin.Api.Dtos
{
    // DTO for returning user data (without the hash)
    public class UserDto
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
    }
}
