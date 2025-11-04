using System.ComponentModel.DataAnnotations;

namespace LabAdmin.Api.Dtos
{
    // This defines the JSON we expect when assigning a ticket
    public class AssignTicketDto
    {
        [Required]
        public int TechnicianId { get; set; }
    }
}
