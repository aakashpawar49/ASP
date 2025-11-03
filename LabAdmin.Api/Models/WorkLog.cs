using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LabAdmin.Api.Models
{
    [Table("worklogs")]
    public class WorkLog
    {
        [Key]
        public int WorkLogId { get; set; }
        public int TicketId { get; set; }
        public int TechnicianId { get; set; }
        public string ActionTaken { get; set; }
        public string Remarks { get; set; }
        public DateTime Timestamp { get; set; }

        [ForeignKey("TicketId")]
        public virtual Ticket Ticket { get; set; }

        [ForeignKey("TechnicianId")]
        public virtual User Technician { get; set; }
    }
}