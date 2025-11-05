using System.Collections.Generic;

namespace LabAdmin.Api.Dtos
{
    // DTO for returning the combined data for the Usage Reports page
    public class UsageReportDto
    {
        public List<ChartDataDto> TicketsResolvedPerLab { get; set; }
        public List<ChartDataDto> TopSoftwareRequests { get; set; }
    }
}