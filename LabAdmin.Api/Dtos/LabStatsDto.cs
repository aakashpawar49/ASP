namespace LabAdmin.Api.Dtos
{
    // Specific class for the "Lab Statistics" widget
    public class LabStatsDto
    {
        public int LabId { get; set; }
        public string LabName { get; set; }
        public int TotalTickets { get; set; }
        public int OpenTickets { get; set; }
        public double PercentageOpen { get; set; }
    }
}
