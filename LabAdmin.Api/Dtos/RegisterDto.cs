using System.ComponentModel.DataAnnotations;

namespace LabAdmin.Api.Dtos
{
    // This defines the JSON we expect for a registration request
    public class RegisterDto
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
