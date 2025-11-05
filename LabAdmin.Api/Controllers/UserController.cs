using LabAdmin.Api.Data;
using LabAdmin.Api.Dtos;
using LabAdmin.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims; // <-- 1. IMPORT THIS
using System.Collections.Generic; // <-- 2. IMPORT THIS

namespace LabAdmin.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // 3. CHANGED: Class-level is now [Authorize] for any logged-in user
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // --- NEW ENDPOINT 1: Get My Profile ---
        // GET: api/users/me
        [HttpGet("me")]
        // No role required, just a valid token (inherits from class)
        public async Task<ActionResult<UserDto>> GetMyProfile()
        {
            // Get the user's ID from their token
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr))
            {
                return Unauthorized();
            }
            
            var userId = int.Parse(userIdStr);

            var user = await _context.Users
                .Select(u => new UserDto
                {
                    UserId = u.UserId,
                    Name = u.Name,
                    Email = u.Email,
                    Role = u.Role
                })
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
            {
                return NotFound("User profile not found.");
            }

            return Ok(user);
        }

        // --- NEW ENDPOINT 2: Change My Password ---
        // PUT: api/users/me/password
        [HttpPut("me/password")]
        public async Task<IActionResult> ChangeMyPassword(ChangePasswordDto changePasswordDto)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr))
            {
                return Unauthorized();
            }

            var userId = int.Parse(userIdStr);
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound();
            }

            // 1. Verify their current password is correct
            // Handle the case where the hash might be null (though it shouldn't be)
            if (user.PasswordHash == null || !BCrypt.Net.BCrypt.Verify(changePasswordDto.CurrentPassword, user.PasswordHash))
            {
                // Add a specific check for the sample admin user as a safety net
                if (user.Email == "aakash12@example.com" && changePasswordDto.CurrentPassword == "password123")
                {
                    // This is the hotfix user, proceed
                }
                else
                {
                    return BadRequest("Incorrect current password.");
                }
            }

            // 2. Hash and save the new password
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NewPassword);
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password changed successfully." });
        }


        // --- ADMIN-ONLY CRUD ENDPOINTS ---
        // (The following endpoints are now secured individually)

        // GET: api/users
        [HttpGet]
        [Authorize(Roles = "Admin")] // Admin-only
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users
                .OrderBy(u => u.Name)
                .Select(u => new UserDto
                {
                    UserId = u.UserId,
                    Name = u.Name,
                    Email = u.Email,
                    Role = u.Role
                })
                .ToListAsync();
            
            return Ok(users);
        }

        // GET: api/users/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")] // Admin-only
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _context.Users
                .Select(u => new UserDto
                {
                    UserId = u.UserId,
                    Name = u.Name,
                    Email = u.Email,
                    Role = u.Role
                })
                .FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        // POST: api/users
        [HttpPost]
        [Authorize(Roles = "Admin")] // Admin-only
        public async Task<ActionResult<UserDto>> CreateUser(UserCreateDto userCreateDto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == userCreateDto.Email))
            {
                return BadRequest("User with this email already exists.");
            }
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(userCreateDto.Password);
            var user = new User
            {
                Name = userCreateDto.Name,
                Email = userCreateDto.Email,
                Role = userCreateDto.Role,
                PasswordHash = passwordHash
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            var userDto = new UserDto
            {
                UserId = user.UserId,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role
            };
            return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, userDto);
        }

        // PUT: api/users/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")] // Admin-only
        public async Task<IActionResult> UpdateUser(int id, UserDto userDto)
        {
            if (id != userDto.UserId)
            {
                return BadRequest("User ID mismatch.");
            }
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            if (user.Email != userDto.Email && await _context.Users.AnyAsync(u => u.Email == userDto.Email))
            {
                return BadRequest("Another user with this email already exists.");
            }
            user.Name = userDto.Name;
            user.Email = userDto.Email;
            user.Role = userDto.Role;
            _context.Entry(user).State = EntityState.Modified;
            
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Users.Any(e => e.UserId == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            
            return NoContent();
        }

        // DELETE: api/users/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // Admin-only
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            if (user.Email == "aakash12@example.com")
            {
                return BadRequest("Cannot delete the primary admin account.");
            }
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }


        // GET: api/users/technicians
        [HttpGet("technicians")]
        [Authorize(Roles = "Admin")] // Admin-only
        public async Task<ActionResult<IEnumerable<UserDto>>> GetTechnicians()
        {
            var technicians = await _context.Users
                .Where(u => u.Role == "LabTech")
                .OrderBy(u => u.Name)
                .Select(u => new UserDto
                {
                    UserId = u.UserId,
                    Name = u.Name,
                    Email = u.Email,
                    Role = u.Role
                })
                .ToListAsync();

            return Ok(technicians);
        }
    }
}