using LabAdmin.Api.Data;
using LabAdmin.Api.Dtos; // <-- 1. IMPORT NEW DTOs
using LabAdmin.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq; // <-- 2. IMPORT LINQ

namespace LabAdmin.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")] // 3. ONLY ADMINS CAN MANAGE USERS
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // --- NEW: GET /api/users ---
        // Gets all users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users
                .OrderBy(u => u.Name)
                .Select(u => new UserDto // 4. Select into a DTO to hide the password hash
                {
                    UserId = u.UserId,
                    Name = u.Name,
                    Email = u.Email,
                    Role = u.Role
                })
                .ToListAsync();

            return Ok(users);
        }

        // --- NEW: GET /api/users/{id} ---
        // Gets a single user by ID
        [HttpGet("{id}")]
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

        // --- NEW: POST /api/users ---
        // Creates a new user
        [HttpPost]
        public async Task<ActionResult<UserDto>> CreateUser(UserCreateDto userCreateDto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == userCreateDto.Email))
            {
                return BadRequest("User with this email already exists.");
            }

            // Hash the password
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

            // Return the safe DTO, not the User object
            var userDto = new UserDto
            {
                UserId = user.UserId,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role
            };

            // Returns a 201 Created response with the new user's data
            return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, userDto);
        }

        // --- NEW: PUT /api/users/{id} ---
        // Updates an existing user
        [HttpPut("{id}")]
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

            // Check if email is being changed to one that already exists
            if (user.Email != userDto.Email && await _context.Users.AnyAsync(u => u.Email == userDto.Email))
            {
                return BadRequest("Another user with this email already exists.");
            }

            // Update properties
            user.Name = userDto.Name;
            user.Email = userDto.Email;
            user.Role = userDto.Role;
            // Note: This endpoint does NOT update the password.
            // That would typically be a separate "reset-password" endpoint.

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

            return NoContent(); // Standard response for a successful PUT
        }

        // --- NEW: DELETE /api/users/{id} ---
        // Deletes a user
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            // Prevent deleting the main admin account (safety check)
            if (user.Email == "aakash12@example.com")
            {
                return BadRequest("Cannot delete the primary admin account.");
            }

            // TODO: Add logic here to re-assign tickets before deleting a tech
            // For now, we'll just delete the user.

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent(); // Standard response for a successful DELETE
        }


        // --- UPDATED: GET /api/users/technicians ---
        // This endpoint already existed but is now updated for security
        [HttpGet("technicians")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetTechnicians()
        {
            var technicians = await _context.Users
                .Where(u => u.Role == "LabTech")
                .OrderBy(u => u.Name)
                .Select(u => new UserDto // 5. Return the safe DTO, not the User model
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
