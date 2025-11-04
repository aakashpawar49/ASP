namespace LabAdmin.Api.Dtos
{
    // This class defines the data for the "stat cards"
    // at the top of the Admin Dashboard.
    public class AdminStatsDto
    {
        public int TicketsRaised { get; set; }
        public int BugsFixed { get; set; }
        public int PendingApproval { get; set; }
        public int SystemsUnderMaintenance { get; set; }
    }
}
