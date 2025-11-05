namespace LabAdmin.Api.Dtos
{
    // DTO for returning a flattened audit log entry
    public class AuditLogDto
    {
        public int WorkLogId { get; set; }
        public DateTime Timestamp { get; set; }
        public string? TechnicianName { get; set; }
        public int TicketId { get; set; }
        public string? TicketDescription { get; set; }
        public string ActionTaken { get; set; }
        public string? Remarks { get; set; }
    }
}