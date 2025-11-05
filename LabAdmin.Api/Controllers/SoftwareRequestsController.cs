using LabAdmin.Api.Data;
using LabAdmin.Api.Dtos;
using LabAdmin.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims; // <-- 1. Import this for getting the user's ID

namespace LabAdmin.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // All endpoints in this file are protected
    public class SoftwareRequestsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SoftwareRequestsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // --- ADMIN ENDPOINT ---
        // GET: api/softwarerequests
        // Admins can see all requests
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<SoftwareRequestDto>>> GetSoftwareRequests([FromQuery] string? status)
        {
            var query = _context.SoftwareRequests
                .Include(sr => sr.Requester)
                .Include(sr => sr.Device)
                    .ThenInclude(d => d.Lab) // Get Lab from Device
                .AsQueryable();

            // Filter by status if provided
            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(sr => sr.Status == status);
            }

            var requests = await query
                .OrderByDescending(sr => sr.CreatedAt)
                .Select(sr => new SoftwareRequestDto
                {
                    // Map data to the safe DTO
                    SoftwareRequestId = sr.SoftwareRequestId,
                    SoftwareName = sr.SoftwareName,
                    Version = sr.Version,
                    Status = sr.Status,
                    CreatedAt = sr.CreatedAt,
                    UpdatedAt = sr.UpdatedAt,
                    RequesterName = sr.Requester.Name,
                    DeviceName = sr.Device.DeviceName,
                    LabName = sr.Device.Lab.LabName
                })
                .ToListAsync();

            return Ok(requests);
        }

        // --- NEW STUDENT/TEACHER ENDPOINT ---
        // GET: api/softwarerequests/my-requests
        [HttpGet("my-requests")]
        [Authorize(Roles = "Student,Teacher,Admin")] // Allows students/teachers to see their own
        public async Task<ActionResult<IEnumerable<SoftwareRequestDto>>> GetMySoftwareRequests()
        {
            // Get the logged-in user's ID from their token
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var requests = await _context.SoftwareRequests
                .Where(sr => sr.RequestedBy == userId) // Filter by the logged-in user
                .Include(sr => sr.Device)
                    .ThenInclude(d => d.Lab)
                .OrderByDescending(sr => sr.CreatedAt)
                .Select(sr => new SoftwareRequestDto
                {
                    SoftwareRequestId = sr.SoftwareRequestId,
                    SoftwareName = sr.SoftwareName,
                    Version = sr.Version,
                    Status = sr.Status,
                    CreatedAt = sr.CreatedAt,
                    UpdatedAt = sr.UpdatedAt,
                    RequesterName = sr.Requester.Name,
                    DeviceName = sr.Device.DeviceName,
                    LabName = sr.Device.Lab.LabName
                })
                .ToListAsync();

            return Ok(requests);
        }

        // --- NEW STUDENT/TEACHER ENDPOINT ---
        // POST: api/softwarerequests
        [HttpPost]
        [Authorize(Roles = "Student,Teacher,Admin")] // Allows students/teachers to create a request
        public async Task<ActionResult<SoftwareRequest>> CreateSoftwareRequest(SoftwareRequestCreateDto requestDto)
        {
            // Get the logged-in user's ID from their token
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            // Check if the device they're requesting for exists
            if (!await _context.Devices.AnyAsync(d => d.DeviceId == requestDto.DeviceId))
            {
                return BadRequest("Invalid Device ID.");
            }

            var softwareRequest = new SoftwareRequest
            {
                DeviceId = requestDto.DeviceId,
                SoftwareName = requestDto.SoftwareName,
                Version = requestDto.Version,
                RequestedBy = userId, // Set from token
                Status = "Pending",   // Default status
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.SoftwareRequests.Add(softwareRequest);
            await _context.SaveChangesAsync();

            // Return the newly created object
            return CreatedAtAction(nameof(GetSoftwareRequests), new { id = softwareRequest.SoftwareRequestId }, softwareRequest);
        }


        // --- ADMIN ENDPOINT ---
        // PUT: api/softwarerequests/{id}/status
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")] // Only Admins can change status
        public async Task<IActionResult> UpdateRequestStatus(int id, UpdateStatusDto statusDto)
        {
            var request = await _context.SoftwareRequests.FindAsync(id);
            if (request == null)
            {
                return NotFound("Software request not found.");
            }

            // Validate the status
            var validStatuses = new[] { "Approved", "Rejected", "Pending" };
            if (!validStatuses.Contains(statusDto.Status))
            {
                return BadRequest("Invalid status. Must be 'Approved', 'Rejected', or 'Pending'.");
            }

            // Update the status and timestamp
            request.Status = statusDto.Status;
            request.UpdatedAt = DateTime.Now;

            _context.Entry(request).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent(); // Standard response for a successful PUT
        }
    }
}
