using LabAdmin.Api.Data;
using LabAdmin.Api.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Globalization;
using System.Linq; // 1. ADD THIS IMPORT

namespace LabAdmin.Api.Controllers
{
    // --- NEW DTO FOR THIS CHART ---
    // This DTO holds the data for the Technician Performance chart
    // e.g., { Month = "Jan", "John Doe" = 5, "Alice Smith" = 8 }
    public class TechPerformanceDto
    {
        // We use a dictionary to hold dynamic keys (the tech names)
        public Dictionary<string, object> Data { get; set; } = new Dictionary<string, object>();
    }


    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        // --- (Existing endpoints: GetAdminStats, GetOpenClosedStats, GetMonthlyBugsFixed, GetLabStats) ---
        // ... (code for your 4 existing endpoints is here) ...
        #region Existing Endpoints
        [HttpGet("admin-stats")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<AdminStatsDto>> GetAdminStats()
        {
            var stats = new AdminStatsDto
            {
                TicketsRaised = await _context.Tickets.CountAsync(),
                BugsFixed = await _context.Tickets.CountAsync(t => t.Status == "Completed"),
                PendingApproval = await _context.Tickets.CountAsync(t => t.Status == "Pending"),
                SystemsUnderMaintenance = await _context.Devices.CountAsync(d => d.Status == "UnderMaintenance")
            };
            return Ok(stats);
        }

        [HttpGet("open-closed-stats")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<ChartDataDto>>> GetOpenClosedStats()
        {
            var openTickets = await _context.Tickets
                .CountAsync(t => t.Status != "Completed" && t.Status != "Rejected");
            var closedTickets = await _context.Tickets
                .CountAsync(t => t.Status == "Completed");
            var stats = new List<ChartDataDto>
            {
                new ChartDataDto { Name = "Open Tickets", Value = openTickets },
                new ChartDataDto { Name = "Closed Tickets", Value = closedTickets }
            };
            return Ok(stats);
        }

        [HttpGet("monthly-bugs")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<ChartDataDto>>> GetMonthlyBugsFixed()
        {
            var completedTickets = await _context.Tickets
                .Where(t => t.Status == "Completed" && t.UpdatedAt >= DateTime.Now.AddMonths(-12))
                .ToListAsync();
            var monthlyData = completedTickets
                .GroupBy(t => t.UpdatedAt.Month)
                .Select(g => new ChartDataDto
                {
                    Name = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(g.Key),
                    Value = g.Count()
                })
                .OrderBy(d => DateTime.ParseExact(d.Name, "MMM", CultureInfo.CurrentCulture).Month)
                .ToList();
            var allMonths = Enumerable.Range(1, 12).Select(i => 
                CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(i)
            );
            var fullMonthlyData = allMonths.Select(monthName => 
                monthlyData.FirstOrDefault(d => d.Name == monthName) ?? new ChartDataDto { Name = monthName, Value = 0 }
            ).ToList();
            return Ok(fullMonthlyData);
        }

        [HttpGet("lab-stats")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<LabStatsDto>>> GetLabStats()
        {
            var labStats = await _context.Labs
                .Select(lab => new LabStatsDto
                {
                    LabId = lab.LabId,
                    LabName = lab.LabName,
                    TotalTickets = _context.Tickets
                        .Count(t => t.Device.LabId == lab.LabId),
                    OpenTickets = _context.Tickets
                        .Count(t => t.Device.LabId == lab.LabId && (t.Status != "Completed" && t.Status != "Rejected"))
                })
                .ToListAsync();
            foreach (var lab in labStats)
            {
                if (lab.TotalTickets > 0)
                {
                    lab.PercentageOpen = Math.Round((double)lab.OpenTickets / lab.TotalTickets * 100, 0);
                }
                else
                {
                    lab.PercentageOpen = 0;
                }
            }
            return Ok(labStats);
        }
        #endregion

        // --- NEW ENDPOINT 4: Technician Performance (Area Chart) ---
        // GET: api/dashboard/tech-performance
        [HttpGet("tech-performance")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Dictionary<string, object>>>> GetTechnicianPerformance()
        {
            var oneYearAgo = DateTime.Now.AddMonths(-12);

            // 1. Get all completed worklogs in the last year
            var worklogs = await _context.WorkLogs
                .Include(wl => wl.Technician) // Include User data
                .Where(wl => wl.Timestamp >= oneYearAgo && wl.Technician != null)
                .ToListAsync();

            // 2. Get a distinct list of technician names
            var techNames = worklogs
                .Select(wl => wl.Technician.Name)
                .Distinct()
                .ToList();

            // 3. Group worklogs by month and technician
            var groupedData = worklogs
                .GroupBy(wl => new { Month = wl.Timestamp.Month, TechName = wl.Technician.Name })
                .Select(g => new
                {
                    Month = g.Key.Month,
                    TechName = g.Key.TechName,
                    Count = g.Count()
                })
                .ToList();

            // 4. Build the final "pivoted" data structure
            var chartData = new List<Dictionary<string, object>>();
            for (int i = 1; i <= 12; i++)
            {
                var monthName = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(i);
                var monthEntry = new Dictionary<string, object>
                {
                    { "month", monthName }
                };

                // For each tech, find their count for this month (or 0)
                foreach (var techName in techNames)
                {
                    var dataPoint = groupedData
                        .FirstOrDefault(d => d.Month == i && d.TechName == techName);
                    
                    monthEntry.Add(techName, dataPoint?.Count ?? 0);
                }
                
                chartData.Add(monthEntry);
            }

            return Ok(chartData);
        }
    }
}
