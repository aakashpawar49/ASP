namespace LabAdmin.Api.Dtos
{
    // DTO for returning lab data
    public class LabDto
    {
        public int LabId { get; set; }
        public string LabName { get; set; }
        public string Location { get; set; }
        public int? LabInchargeId { get; set; }
        public string? LabInchargeName { get; set; } // Read-only, for display
    }
}