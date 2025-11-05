using System.ComponentModel.DataAnnotations;

namespace LabAdmin.Api.Dtos
{
    // DTO for creating a new ticket
    public class TicketCreateDto
    {
        [Required]
        public int DeviceId { get; set; }

        [Required]
        [MinLength(10)]
        public string IssueDescription { get; set; }
    }
}