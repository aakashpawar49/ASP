using LabAdmin.Api.Data;
using LabAdmin.Api.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Collections.Generic; // Required for List<>
using System.Globalization;     // Required for Month Names

namespace LabAdmin.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")] // Only Admins can access reports
    public class ReportsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReportsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/reports/audittrail
        // Fetches all worklogs for the audit trail
        [HttpGet("audittrail")]
        public async Task<ActionResult<IEnumerable<AuditLogDto>>> GetAuditTrail()
        {
            var auditLogs = await _context.WorkLogs
                .Include(wl => wl.Technician) // Include the User (technician)
                .Include(wl => wl.Ticket)     // Include the related Ticket
                .OrderByDescending(wl => wl.Timestamp) // Show most recent first
                .Select(wl => new AuditLogDto
                {
                    WorkLogId = wl.WorkLogId,
                    Timestamp = wl.Timestamp,
                    TechnicianName = wl.Technician.Name,
                    TicketId = wl.TicketId,
                    TicketDescription = wl.Ticket.IssueDescription,
                    ActionTaken = wl.ActionTaken,
                    Remarks = wl.Remarks
                })
                .ToListAsync();

            return Ok(auditLogs);
        }

        // GET: api/reports/usage
        // Fetches stats for the Usage Reports page
        [HttpGet("usage")]
        public async Task<ActionResult<UsageReportDto>> GetUsageStats()
        {
            // 1. Get Tickets Resolved Per Lab
            var ticketsPerLab = await _context.Tickets
                .Where(t => t.Status == "Completed")
                .Include(t => t.Device.Lab)
                .GroupBy(t => t.Device.Lab.LabName)
                .Select(g => new ChartDataDto
                {
                    Name = g.Key, // Lab Name
                    Value = g.Count() // Count of completed tickets
                })
                .OrderByDescending(x => x.Value)
                .ToListAsync();

            // 2. Get Top 5 Software Requests
            var topSoftware = await _context.SoftwareRequests
                .GroupBy(sr => sr.SoftwareName)
                .Select(g => new ChartDataDto
                {
                    Name = g.Key, // Software Name
                    Value = g.Count() // Number of times requested
                })
                .OrderByDescending(x => x.Value)
                .Take(5)
                .ToListAsync();
            
            // 3. Bundle and Return
            var report = new UsageReportDto
            {
                TicketsResolvedPerLab = ticketsPerLab,
                TopSoftwareRequests = topSoftware
            };

            return Ok(report);
        }
    }
}