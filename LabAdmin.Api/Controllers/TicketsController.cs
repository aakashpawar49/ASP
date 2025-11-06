using LabAdmin.Api.Data;
using LabAdmin.Api.Dtos;
using LabAdmin.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims; // For getting the logged-in user's ID
using System.Linq;
using System.Collections.Generic;

namespace LabAdmin.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // All endpoints in this controller require login
    public class TicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TicketsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // --- ADMIN/TECH ENDPOINTS ---

        // GET: api/tickets
        // Admins/Techs can see all tickets (with filter)
        [HttpGet]
        [Authorize(Roles = "Admin,LabTech")]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetTickets([FromQuery] string? status)
        {
            var query = _context.Tickets
                .Include(t => t.Requester)
                .Include(t => t.Device)
                .ThenInclude(d => d.Lab)
                .Include(t => t.Technician)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(t => t.Status == status);
            }

            var tickets = await query
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            // Never send password hashes to the client
            foreach (var ticket in tickets)
            {
                if (ticket.Requester != null) ticket.Requester.PasswordHash = null;
                if (ticket.Technician != null) ticket.Technician.PasswordHash = null;
            }

            return Ok(tickets);
        }

        // GET: api/tickets/recent
        // For Admin dashboard widget
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

        // --- ADMIN-ONLY ENDPOINT ---

        // PUT: api/tickets/{id}/assign
        // For Admins to assign a ticket
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

        // --- STUDENT/TEACHER ENDPOINTS ---

        // GET: api/tickets/my-requests
        // For Students/Teachers to see their own submitted tickets
        [HttpGet("my-requests")]
        [Authorize(Roles = "Student,Teacher,Admin")]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetMyRequests()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var myTickets = await _context.Tickets
                .Where(t => t.RequestedBy == userId)
                .Include(t => t.Device)
                .ThenInclude(d => d.Lab)
                .Include(t => t.Technician)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            foreach (var ticket in myTickets)
            {
                if (ticket.Technician != null) ticket.Technician.PasswordHash = null;
            }

            return Ok(myTickets);
        }

        // POST: api/tickets
        // For Students/Teachers to create a new ticket
        [HttpPost]
        [Authorize(Roles = "Student,Teacher,Admin")]
        public async Task<ActionResult<Ticket>> CreateTicket(TicketCreateDto ticketDto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (!await _context.Devices.AnyAsync(d => d.DeviceId == ticketDto.DeviceId))
            {
                return BadRequest("Invalid Device ID.");
            }

            var ticket = new Ticket
            {
                DeviceId = ticketDto.DeviceId,
                IssueDescription = ticketDto.IssueDescription,
                RequestedBy = userId,
                Status = "Pending",
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTickets), new { id = ticket.TicketId }, ticket);
        }

        // --- NEW LABTECH ENDPOINTS ---

        // GET: api/tickets/my-assigned
        // For LabTechs to see their "to-do list"
        [HttpGet("my-assigned")]
        [Authorize(Roles = "LabTech")]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetMyAssignedTickets()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var myTickets = await _context.Tickets
                // Get tickets assigned to me that are not yet finished
                .Where(t => t.AssignedTo == userId && (t.Status == "Assigned" || t.Status == "InProgress"))
                .Include(t => t.Requester)
                .Include(t => t.Device)
                .ThenInclude(d => d.Lab)
                .OrderBy(t => t.Status)
                .ThenByDescending(t => t.CreatedAt)
                .ToListAsync();

            foreach (var ticket in myTickets)
            {
                if (ticket.Requester != null) ticket.Requester.PasswordHash = null;
            }

            return Ok(myTickets);
        }

        // PUT: api/tickets/{id}/tech-update
        // For LabTechs to update status AND add a work log
        [HttpPut("{id}/tech-update")]
        [Authorize(Roles = "LabTech")]
        public async Task<IActionResult> TechUpdateTicket(int id, TechUpdateTicketDto updateDto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
            {
                return NotFound("Ticket not found.");
            }

            // --- SECURITY CHECK: Is this ticket assigned to me? ---
            if (ticket.AssignedTo != userId)
            {
                return Forbid("This ticket is not assigned to you.");
            }

            // Validate the new status
            var validStatuses = new[] { "InProgress", "Completed" };
            if (!validStatuses.Contains(updateDto.NewStatus))
            {
                return BadRequest("Invalid status. Must be 'InProgress' or 'Completed'.");
            }

            // 1. Update the ticket
            ticket.Status = updateDto.NewStatus;
            ticket.UpdatedAt = DateTime.Now;

            // 2. Create the new WorkLog entry
            var workLog = new WorkLog
            {
                TicketId = ticket.TicketId,
                TechnicianId = userId, // The logged-in tech
                ActionTaken = updateDto.ActionTaken,
                Remarks = updateDto.Remarks,
                Timestamp = DateTime.Now
            };
            _context.WorkLogs.Add(workLog);

            // 3. Save both changes in a single transaction
            await _context.SaveChangesAsync();

            return NoContent(); // Success
        }
    }
}
