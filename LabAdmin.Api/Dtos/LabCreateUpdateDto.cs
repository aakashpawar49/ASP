using System.ComponentModel.DataAnnotations;

namespace LabAdmin.Api.Dtos
{
    // DTO for creating or updating a lab
    public class LabCreateUpdateDto
    {
        [Required]
        public string LabName { get; set; }

        [Required]
        public string Location { get; set; }

        // The ID of the user (Admin or Teacher) assigned as incharge
        public int? LabInchargeId { get; set; }
    }
}