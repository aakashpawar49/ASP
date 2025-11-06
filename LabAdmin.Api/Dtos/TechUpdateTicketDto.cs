using System.ComponentModel.DataAnnotations;

namespace LabAdmin.Api.Dtos
{
    // DTO for a LabTech updating a ticket
    public class TechUpdateTicketDto
    {
        [Required]
        public string NewStatus { get; set; } // e.g., "InProgress" or "Completed"

        [Required]
        [MinLength(5)]
        public string ActionTaken { get; set; } // The note for the work log

        public string? Remarks { get; set; } // Optional remarks
    }
}