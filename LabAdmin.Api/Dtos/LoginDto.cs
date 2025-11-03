using System.ComponentModel.DataAnnotations;

namespace LabAdmin.Api.Dtos
{
    // This defines the JSON we expect for a login request
    public class LoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}