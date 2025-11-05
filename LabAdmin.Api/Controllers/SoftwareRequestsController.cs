using LabAdmin.Api.Data;
using LabAdmin.Api.Dtos;
using LabAdmin.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace LabAdmin.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // All endpoints are protected
    public class SoftwareRequestsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SoftwareRequestsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/softwarerequests
        // Gets all software requests, with an optional filter by status
        [HttpGet]
        [Authorize(Roles = "Admin")] // Only Admins can see the full list
        public async Task<ActionResult<IEnumerable<SoftwareRequestDto>>> GetSoftwareRequests([FromQuery] string? status)
        {
            var query = _context.SoftwareRequests
                .Include(sr => sr.Requester)  // Include the User
                .Include(sr => sr.Device)     // Include the Device
                    .ThenInclude(d => d.Lab) // Include the Lab from the Device
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(sr => sr.Status == status);
            }

            // Project into our safe DTO
            var requests = await query
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

        // PUT: api/softwarerequests/{id}/status
        // Approves or rejects a software request
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")] // Only Admins can change status
        public async Task<IActionResult> UpdateRequestStatus(int id, UpdateStatusDto statusDto)
        {
            var request = await _context.SoftwareRequests.FindAsync(id);
            if (request == null)
            {
                return NotFound("Software request not found.");
            }

            // Validate the new status
            var validStatuses = new[] { "Approved", "Rejected", "Pending" };
            if (!validStatuses.Contains(statusDto.Status))
            {
                return BadRequest("Invalid status. Must be 'Approved' or 'Rejected'.");
            }

            // Update the status and timestamp
            request.Status = statusDto.Status;
            request.UpdatedAt = DateTime.Now;

            _context.Entry(request).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent(); // Success, no content to return
        }

        // TODO: We will need a new endpoint for Students/Teachers to POST (create)
        // a new software request. We can add that when we build their dashboards.
    }
}