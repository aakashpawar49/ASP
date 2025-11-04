using LabAdmin.Api.Data;
using LabAdmin.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LabAdmin.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // All endpoints here are protected
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/users/technicians
        [HttpGet("technicians")]
        [Authorize(Roles = "Admin")] // Only Admins can get this list
        public async Task<ActionResult<IEnumerable<User>>> GetTechnicians()
        {
            var technicians = await _context.Users
                .Where(u => u.Role == "LabTech")
                .OrderBy(u => u.Name)
                .ToListAsync();

            // IMPORTANT: Never send the password hash to the client
            foreach (var tech in technicians)
            {
                tech.PasswordHash = null; 
            }

            return Ok(technicians);
        }
    }
}
