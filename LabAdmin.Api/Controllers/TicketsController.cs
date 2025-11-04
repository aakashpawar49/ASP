using LabAdmin.Api.Data;
using LabAdmin.Api.Dtos; // <-- Added Dtos
using LabAdmin.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LabAdmin.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // All endpoints in this controller are protected
    public class TicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TicketsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // --- NEW ENDPOINT 1: Get All Tickets (with filter) ---
        // GET: api/tickets
        [HttpGet]
        [Authorize(Roles = "Admin,LabTech")]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetTickets([FromQuery] string? status)
        {
            // Start with a queryable object
            var query = _context.Tickets
                .Include(t => t.Requester)  // Gets the User
                .Include(t => t.Technician) // Gets the Assigned User
                .Include(t => t.Device)     // Gets the Device
                .ThenInclude(d => d.Lab) // Gets the Lab *from* the Device
                .AsQueryable();

            // If a status is provided, filter by it
            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(t => t.Status == status);
            }

            // Get the final list
            var tickets = await query
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            // Clean password hashes before sending
            foreach (var ticket in tickets)
            {
                if (ticket.Requester != null)
                {
                    ticket.Requester.PasswordHash = null;
                }
                if (ticket.Technician != null)
                {
                    ticket.Technician.PasswordHash = null;
                }
            }

            return Ok(tickets);
        }

        // --- EXISTING ENDPOINT ---
        // GET: api/tickets/recent
        [HttpGet("recent")]
        [Authorize(Roles = "Admin,LabTech")]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetRecentTickets()
        {
            var recentTickets = await _context.Tickets
                .Include(t => t.Requester)
                .Include(t => t.Device)
                .ThenInclude(d => d.Lab) // Also include Lab info
                .OrderByDescending(t => t.CreatedAt)
                .Take(10)
                .ToListAsync();

            foreach (var ticket in recentTickets)
            {
                if (ticket.Requester != null)
                {
                    ticket.Requester.PasswordHash = null;
                }
            }

            return Ok(recentTickets);
        }

        // --- NEW ENDPOINT 2: Assign a Ticket ---
        // PUT: api/tickets/5/assign
        [HttpPut("{id}/assign")]
        [Authorize(Roles = "Admin")] // Only Admins can assign tickets
        public async Task<IActionResult> AssignTicket(int id, AssignTicketDto assignDto)
        {
            // 1. Find the ticket
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
            {
                return NotFound("Ticket not found.");
            }

            // 2. Find the technician
            var technician = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == assignDto.TechnicianId && u.Role == "LabTech");

            if (technician == null)
            {
                return BadRequest("Invalid Technician ID.");
            }

            // 3. Update the ticket
            ticket.AssignedTo = assignDto.TechnicianId;
            ticket.Status = "Assigned";
            ticket.UpdatedAt = DateTime.Now; // Update the timestamp

            // 4. Save changes
            await _context.SaveChangesAsync();

            // Return the updated ticket
            return Ok(ticket);
        }
    }
}
