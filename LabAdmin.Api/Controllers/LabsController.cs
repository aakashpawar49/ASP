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
    [Authorize] // 1. CHANGED: Now authorizes ANY logged-in user
    public class LabsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LabsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/labs
        [HttpGet]
        [Authorize(Roles = "Admin")] // 2. ADDED: Admin-only for this
        public async Task<ActionResult<IEnumerable<LabDto>>> GetLabs()
        {
            var labs = await _context.Labs
                .Include(l => l.LabIncharge)
                .OrderBy(l => l.LabName)
                .Select(l => new LabDto
                {
                    LabId = l.LabId,
                    LabName = l.LabName,
                    Location = l.Location,
                    LabInchargeId = l.LabInchargeId,
                    LabInchargeName = l.LabIncharge.Name
                })
                .ToListAsync();

            return Ok(labs);
        }

        // --- NEW PUBLIC ENDPOINT ---
        // GET: api/labs/list
        [HttpGet("list")]
        [Authorize] // 3. This is public for any logged-in user
        public async Task<ActionResult<IEnumerable<LabDto>>> GetLabList()
        {
            var labs = await _context.Labs
                .OrderBy(l => l.LabName)
                .Select(l => new LabDto
                {
                    LabId = l.LabId,
                    LabName = l.LabName,
                    Location = l.Location
                })
                .ToListAsync();

            return Ok(labs);
        }

        // GET: api/labs/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")] // 4. ADDED: Admin-only
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
        [HttpPost]
        [Authorize(Roles = "Admin")] // 5. ADDED: Admin-only
        public async Task<ActionResult<LabDto>> CreateLab(LabCreateUpdateDto labDto)
        {
            var lab = new Lab
            {
                LabName = labDto.LabName,
                Location = labDto.Location,
                LabInchargeId = labDto.LabInchargeId
            };
            _context.Labs.Add(lab);
            await _context.SaveChangesAsync();

            var newLabDto = (await GetLab(lab.LabId)).Value;
            return CreatedAtAction(nameof(GetLab), new { id = lab.LabId }, newLabDto);
        }

        // PUT: api/labs/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")] // 6. ADDED: Admin-only
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
            _context.Entry(lab).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/labs/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // 7. ADDED: Admin-only
        public async Task<IActionResult> DeleteLab(int id)
        {
            var lab = await _context.Labs.FindAsync(id);
            if (lab == null)
            {
                return NotFound();
            }
            var devicesInLab = await _context.Devices.AnyAsync(d => d.LabId == id);
            if (devicesInLab)
            {
                return BadRequest("Cannot delete lab. Reassign all devices from this lab first.");
            }
            _context.Labs.Remove(lab);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
