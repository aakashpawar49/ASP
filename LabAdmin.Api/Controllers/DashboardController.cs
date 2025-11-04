using LabAdmin.Api.Data;
using LabAdmin.Api.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Globalization; // Added for month names

namespace LabAdmin.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // All endpoints in this controller are protected
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/dashboard/admin-stats
        // This endpoint provides data for the 4 stat cards
        [HttpGet("admin-stats")]
        [Authorize(Roles = "Admin")] // Only Admins can access this
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

        // --- NEW ENDPOINT 1: Open vs Closed Tickets (Donut Chart) ---
        // GET: api/dashboard/open-closed-stats
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

        // --- NEW ENDPOINT 2: Monthly Bugs Fixed (Bar Chart) ---
        // GET: api/dashboard/monthly-bugs
        [HttpGet("monthly-bugs")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<ChartDataDto>>> GetMonthlyBugsFixed()
        {
            var yearAgo = DateTime.Now.AddMonths(-12);

            // Get all completed tickets from the last 12 months
            var completedTickets = await _context.Tickets
                .Where(t => t.Status == "Completed" && t.UpdatedAt >= yearAgo)
                .ToListAsync();

            // Group by month
            var monthlyData = completedTickets
                .GroupBy(t => t.UpdatedAt.Month)
                .Select(g => new 
                {
                    Month = g.Key,
                    Count = g.Count()
                })
                .ToList();

            // Create a full 12-month list to ensure all months are present
            var allMonthsData = new List<ChartDataDto>();
            for (int i = 0; i < 12; i++)
            {
                var month = DateTime.Now.AddMonths(-i);
                var monthName = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(month.Month);
                var data = monthlyData.FirstOrDefault(d => d.Month == month.Month);
                
                allMonthsData.Add(new ChartDataDto 
                { 
                    Name = monthName, 
                    Value = data?.Count ?? 0 
                });
            }

            // Reverse to get chronological order
            allMonthsData.Reverse(); 
            return Ok(allMonthsData);
        }

        // --- NEW ENDPOINT 3: Lab Statistics (Bar List) ---
        // GET: api/dashboard/lab-stats
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
            
            // Calculate percentage in C#
            foreach (var lab in labStats)
            {
                if (lab.TotalTickets > 0)
                {
                    // Calculate (Open / Total) * 100
                    lab.PercentageOpen = Math.Round((double)lab.OpenTickets / lab.TotalTickets * 100, 0);
                }
                else
                {
                    lab.PercentageOpen = 0;
                }
            }

            return Ok(labStats);
        }
    }
}
