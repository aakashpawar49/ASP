using System.ComponentModel.DataAnnotations;

namespace LabAdmin.Api.Dtos
{
    // DTO for creating or updating a device
    public class DeviceCreateUpdateDto
    {
        [Required]
        public string DeviceName { get; set; }

        [Required]
        public string DeviceType { get; set; } // e.g., "Computer", "Printer"

        public string? Brand { get; set; }
        public string? Model { get; set; }

        [Required]
        public string SerialNumber { get; set; }

        [Required]
        public string Status { get; set; } // e.g., "Operational", "UnderMaintenance"

        [Required]
        public int LabId { get; set; } // Which lab this device belongs to
    }
}
