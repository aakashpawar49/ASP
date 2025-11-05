using System.ComponentModel.DataAnnotations;

namespace LabAdmin.Api.Dtos
{
    // DTO for creating a new software request
    public class SoftwareRequestCreateDto
    {
        [Required]
        public int DeviceId { get; set; }

        [Required]
        public string SoftwareName { get; set; }

        public string? Version { get; set; }
    }
}