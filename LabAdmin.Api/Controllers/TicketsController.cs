using LabAdmin.Api.Data;
using LabAdmin.Api.Dtos; 
using LabAdmin.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims; // <-- 1. IMPORT THIS

namespace LabAdmin.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TicketsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/tickets
        // Admins/Techs can see all tickets
        [HttpGet]
        [Authorize(Roles = "Admin,LabTech")]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetTickets([FromQuery] string? status)
        {
            var query = _context.Tickets
                .Include(t => t.Requester)
                .Include(t => t.Device)
                .ThenInclude(d => d.Lab)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(t => t.Status == status);
            }

            var tickets = await query
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            foreach (var ticket in tickets)
            {
                if (ticket.Requester != null) ticket.Requester.PasswordHash = null;
                if (ticket.Technician != null) ticket.Technician.PasswordHash = null;
            }

            return Ok(tickets);
        }

        // --- NEW ENDPOINT 1: Get MY Tickets ---
        // GET: api/tickets/my-requests
        [HttpGet("my-requests")]
        [Authorize(Roles = "Student,Teacher,Admin")] // Students/Teachers can see their own
        public async Task<ActionResult<IEnumerable<Ticket>>> GetMyRequests()
        {
            // Get the logged-in user's ID from their token
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var myTickets = await _context.Tickets
                .Where(t => t.RequestedBy == userId) // Filter by logged-in user
                .Include(t => t.Device)
                .ThenInclude(d => d.Lab)
                .Include(t => t.Technician) // See who it's assigned to
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            foreach (var ticket in myTickets)
            {
                // Clean hash from technician object
                if (ticket.Technician != null) ticket.Technician.PasswordHash = null;
            }

            return Ok(myTickets);
        }

        // GET: api/tickets/recent
        [HttpGet("recent")]
        [Authorize(Roles = "Admin,LabTech")]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetRecentTickets()
        {
            var recentTickets = await _context.Tickets
                .Include(t => t.Requester)
                .Include(t => t.Device)
                .ThenInclude(d => d.Lab)
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

        // --- NEW ENDPOINT 2: Create a Ticket ---
        // POST: api/tickets
        [HttpPost]
        [Authorize(Roles = "Student,Teacher,Admin")] // Students/Teachers can create
        public async Task<ActionResult<Ticket>> CreateTicket(TicketCreateDto ticketDto)
        {
            // Get the logged-in user's ID from their token
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            // Check if the device exists
            if (!await _context.Devices.AnyAsync(d => d.DeviceId == ticketDto.DeviceId))
            {
                return BadRequest("Invalid Device ID.");
            }

            var ticket = new Ticket
            {
                DeviceId = ticketDto.DeviceId,
                IssueDescription = ticketDto.IssueDescription,
                RequestedBy = userId, // Set from token
                Status = "Pending",   // Default status
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTickets), new { id = ticket.TicketId }, ticket);
        }


        // PUT: api/tickets/{id}/assign
        [HttpPut("{id}/assign")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AssignTicket(int id, AssignTicketDto assignDto)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
            {
                return NotFound("Ticket not found.");
            }
            var technician = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == assignDto.TechnicianId && u.Role == "LabTech");
            if (technician == null)
            {
                return BadRequest("Invalid Technician ID.");
            }
            ticket.AssignedTo = assignDto.TechnicianId;
            ticket.Status = "Assigned";
            ticket.UpdatedAt = DateTime.Now;
            await _context.SaveChangesAsync();
            return Ok(ticket);
        }
    }
}
