namespace LabAdmin.Api.Dtos
{
    // DTO for returning a software request with all related names
    public class SoftwareRequestDto
    {
        public int SoftwareRequestId { get; set; }
        public string SoftwareName { get; set; }
        public string? Version { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Related data
        public string? RequesterName { get; set; }
        public string? DeviceName { get; set; }
        public string? LabName { get; set; }
    }
}