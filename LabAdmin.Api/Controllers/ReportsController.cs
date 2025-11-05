using LabAdmin.Api.Data;
using LabAdmin.Api.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

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

        // We can add other report endpoints here later, like:
        // GET: api/reports/usagestats
    }
}
