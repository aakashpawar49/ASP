using System.ComponentModel.DataAnnotations;

namespace LabAdmin.Api.Dtos
{
    // DTO for an Admin creating a new user
    public class UserCreateDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Role { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }
    }
}
