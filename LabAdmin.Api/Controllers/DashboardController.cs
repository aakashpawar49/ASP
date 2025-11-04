using LabAdmin.Api.Data;
using LabAdmin.Api.Dtos;
using Microsoft.AspNetCore.Authorization; // <-- Import Authorization
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LabAdmin.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // <-- Protects all endpoints in this controller
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/dashboard/admin-stats
        [HttpGet("admin-stats")]
        [Authorize(Roles = "Admin")] // <-- Only Admins can access this
        public async Task<ActionResult<AdminStatsDto>> GetAdminStats()
        {
            var stats = new AdminStatsDto
            {
                // We use LINQ to query the database
                TicketsRaised = await _context.Tickets.CountAsync(),
                BugsFixed = await _context.Tickets.CountAsync(t => t.Status == "Completed"),
                PendingApproval = await _context.Tickets.CountAsync(t => t.Status == "Pending"),
                SystemsUnderMaintenance = await _context.Devices.CountAsync(d => d.Status == "UnderMaintenance")
            };

            return Ok(stats);
        }

        // Add more dashboard endpoints for other roles (Student, etc.) here later
    }
}
