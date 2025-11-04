using LabAdmin.Api.Data;
using LabAdmin.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LabAdmin.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // <-- Protects all ticket endpoints
    public class TicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TicketsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/tickets/recent
        [HttpGet("recent")]
        [Authorize(Roles = "Admin,LabTech")] // Only Admins and Techs can see this list
        public async Task<ActionResult<IEnumerable<Ticket>>> GetRecentTickets()
        {
            // Get the 10 most recent tickets
            // We also "Include" the related User and Device data
            var recentTickets = await _context.Tickets
                .Include(t => t.Requester)  // Gets the User who requested it
                .Include(t => t.Device)     // Gets the Device it's for
                .OrderByDescending(t => t.CreatedAt)
                .Take(10)
                .ToListAsync();

            // We must set Requester.PasswordHash to null to avoid leaking it
            foreach (var ticket in recentTickets)
            {
                if (ticket.Requester != null)
                {
                    ticket.Requester.PasswordHash = null;
                }
            }

            return Ok(recentTickets);
        }

        // We will add more endpoints here later, e.g.:
        // GET: api/tickets (get all tickets)
        // GET: api/tickets/{id} (get one ticket)
        // POST: api/tickets (create a new ticket)
        // PUT: api/tickets/{id}/assign (assign a ticket)
    }
}
