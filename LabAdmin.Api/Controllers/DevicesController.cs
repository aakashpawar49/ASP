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
    [Authorize(Roles = "Admin")] // Only Admins can manage devices
    public class DevicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DevicesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/devices
        // Gets all devices, with an optional filter by lab
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DeviceDto>>> GetDevices([FromQuery] int? labId)
        {
            var query = _context.Devices
                .Include(d => d.Lab) // Include Lab data
                .OrderBy(d => d.DeviceName)
                .AsQueryable();

            if (labId.HasValue)
            {
                query = query.Where(d => d.LabId == labId.Value);
            }

            var devices = await query.Select(d => new DeviceDto
            {
                DeviceId = d.DeviceId,
                DeviceName = d.DeviceName,
                DeviceType = d.DeviceType,
                Brand = d.Brand,
                Model = d.Model,
                SerialNumber = d.SerialNumber,
                Status = d.Status,
                LabId = d.LabId,
                LabName = d.Lab.LabName // Get name from included Lab
            })
                .ToListAsync();

            return Ok(devices);
        }

        // GET: api/devices/{id}
        // Gets a single device by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<DeviceDto>> GetDevice(int id)
        {
            var device = await _context.Devices
                .Include(d => d.Lab)
                .Select(d => new DeviceDto
                {
                    DeviceId = d.DeviceId,
                    DeviceName = d.DeviceName,
                    DeviceType = d.DeviceType,
                    Brand = d.Brand,
                    Model = d.Model,
                    SerialNumber = d.SerialNumber,
                    Status = d.Status,
                    LabId = d.LabId,
                    LabName = d.Lab.LabName
                })
                .FirstOrDefaultAsync(d => d.DeviceId == id);

            if (device == null)
            {
                return NotFound();
            }

            return Ok(device);
        }

        // POST: api/devices
        // Creates a new device
        [HttpPost]
        public async Task<ActionResult<DeviceDto>> CreateDevice(DeviceCreateUpdateDto deviceDto)
        {
            // Check for duplicate serial number
            if (await _context.Devices.AnyAsync(d => d.SerialNumber == deviceDto.SerialNumber))
            {
                return BadRequest("A device with this serial number already exists.");
            }

            // Check if LabId is valid
            if (!await _context.Labs.AnyAsync(l => l.LabId == deviceDto.LabId))
            {
                return BadRequest("Invalid Lab ID.");
            }

            var device = new Device
            {
                DeviceName = deviceDto.DeviceName,
                DeviceType = deviceDto.DeviceType,
                Brand = deviceDto.Brand,
                Model = deviceDto.Model,
                SerialNumber = deviceDto.SerialNumber,
                Status = deviceDto.Status,
                LabId = deviceDto.LabId
            };

            _context.Devices.Add(device);
            await _context.SaveChangesAsync();

            // We reload the device to get the Lab Name for the return DTO
            var newDeviceDto = (await GetDevice(device.DeviceId)).Value;

            return CreatedAtAction(nameof(GetDevice), new { id = device.DeviceId }, newDeviceDto);
        }

        // PUT: api/devices/{id}
        // Updates an existing device
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDevice(int id, DeviceCreateUpdateDto deviceDto)
        {
            var device = await _context.Devices.FindAsync(id);
            if (device == null)
            {
                return NotFound();
            }

            // Check if serial number is being changed to one that already exists
            if (device.SerialNumber != deviceDto.SerialNumber &&
                await _context.Devices.AnyAsync(d => d.SerialNumber == deviceDto.SerialNumber))
            {
                return BadRequest("A device with this serial number already exists.");
            }

            // Check if LabId is valid
            if (!await _context.Labs.AnyAsync(l => l.LabId == deviceDto.LabId))
            {
                return BadRequest("Invalid Lab ID.");
            }

            // Map properties
            device.DeviceName = deviceDto.DeviceName;
            device.DeviceType = deviceDto.DeviceType;
            device.Brand = deviceDto.Brand;
            device.Model = deviceDto.Model;
            device.SerialNumber = deviceDto.SerialNumber;
            device.Status = deviceDto.Status;
            device.LabId = deviceDto.LabId;

            _context.Entry(device).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent(); // Standard response for a successful PUT
        }

        // DELETE: api/devices/{id}
        // Deletes a device
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDevice(int id)
        {
            var device = await _context.Devices.FindAsync(id);
            if (device == null)
            {
                return NotFound();
            }

            // CRITICAL: Check for dependencies. Can't delete a device if it has tickets.
            var hasTickets = await _context.Tickets.AnyAsync(t => t.DeviceId == id);
            var hasSoftwareRequests = await _context.SoftwareRequests.AnyAsync(sr => sr.DeviceId == id);
            if (hasTickets || hasSoftwareRequests)
            {
                return BadRequest("Cannot delete device. It has associated tickets or software requests. Please delete them first.");
            }

            _context.Devices.Remove(device);
            await _context.SaveChangesAsync();

            return NoContent(); // Standard response for a successful DELETE
        }
    }
}
