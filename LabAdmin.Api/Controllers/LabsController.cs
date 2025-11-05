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
    [Authorize(Roles = "Admin")] // Only Admins can manage labs
    public class LabsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LabsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/labs
        // Gets all labs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LabDto>>> GetLabs()
        {
            var labs = await _context.Labs
                .Include(l => l.LabIncharge) // Include the User navigation property
                .OrderBy(l => l.LabName)
                .Select(l => new LabDto
                {
                    LabId = l.LabId,
                    LabName = l.LabName,
                    Location = l.Location,
                    LabInchargeId = l.LabInchargeId,
                    // Get the name from the included User object
                    LabInchargeName = l.LabIncharge.Name
                })
                .ToListAsync();

            return Ok(labs);
        }

        // GET: api/labs/{id}
        // Gets a single lab by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<LabDto>> GetLab(int id)
        {
            var lab = await _context.Labs
                .Include(l => l.LabIncharge)
                .Select(l => new LabDto
                {
                    LabId = l.LabId,
                    LabName = l.LabName,
                    Location = l.Location,
                    LabInchargeId = l.LabInchargeId,
                    LabInchargeName = l.LabIncharge.Name
                })
                .FirstOrDefaultAsync(l => l.LabId == id);

            if (lab == null)
            {
                return NotFound();
            }

            return Ok(lab);
        }

        // POST: api/labs
        // Creates a new lab
        [HttpPost]
        public async Task<ActionResult<LabDto>> CreateLab(LabCreateUpdateDto labDto)
        {
            var lab = new Lab
            {
                LabName = labDto.LabName,
                Location = labDto.Location,
                LabInchargeId = labDto.LabInchargeId
            };

            // TODO: Verify LabInchargeId belongs to a valid Admin or Teacher

            _context.Labs.Add(lab);
            await _context.SaveChangesAsync();

            // We reload the lab to get the Incharge's Name for the return DTO
            var newLabDto = await GetLab(lab.LabId);

            return CreatedAtAction(nameof(GetLab), new { id = lab.LabId }, newLabDto.Value);
        }

        // PUT: api/labs/{id}
        // Updates an existing lab
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLab(int id, LabCreateUpdateDto labDto)
        {
            var lab = await _context.Labs.FindAsync(id);
            if (lab == null)
            {
                return NotFound();
            }

            lab.LabName = labDto.LabName;
            lab.Location = labDto.Location;
            lab.LabInchargeId = labDto.LabInchargeId;
            // TODO: Verify LabInchargeId is valid

            _context.Entry(lab).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent(); // Standard response for a successful PUT
        }

        // DELETE: api/labs/{id}
        // Deletes a lab
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLab(int id)
        {
            var lab = await _context.Labs.FindAsync(id);
            if (lab == null)
            {
                return NotFound();
            }

            // Check if any devices are still assigned to this lab
            var devicesInLab = await _context.Devices.AnyAsync(d => d.LabId == id);
            if (devicesInLab)
            {
                return BadRequest("Cannot delete lab. Reassign all devices from this lab first.");
            }

            _context.Labs.Remove(lab);
            await _context.SaveChangesAsync();

            return NoContent(); // Standard response for a successful DELETE
        }
    }
}
