using System.ComponentModel.DataAnnotations;

namespace LabAdmin.Api.Dtos
{
    // A generic DTO for updating the status of a ticket or request
    public class UpdateStatusDto
    {
        [Required]
        public string Status { get; set; }
    }
}