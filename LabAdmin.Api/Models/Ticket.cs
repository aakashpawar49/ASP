using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LabAdmin.Api.Models
{
    [Table("tickets")]
    public class Ticket
    {
        [Key]
        public int TicketId { get; set; }
        public int DeviceId { get; set; }
        public int RequestedBy { get; set; }
        public int? AssignedTo { get; set; }
        public string IssueDescription { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        [ForeignKey("DeviceId")]
        public virtual Device Device { get; set; }

        [ForeignKey("RequestedBy")]
        public virtual User Requester { get; set; }

        [ForeignKey("AssignedTo")]
        public virtual User Technician { get; set; }
    }
}