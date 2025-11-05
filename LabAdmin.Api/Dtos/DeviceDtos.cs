namespace LabAdmin.Api.Dtos
{
    // DTO for returning device (system/machine) data
    public class DeviceDto
    {
        public int DeviceId { get; set; }
        public string DeviceName { get; set; }
        public string DeviceType { get; set; }
        public string? Brand { get; set; }
        public string? Model { get; set; }
        public string? SerialNumber { get; set; }
        public string Status { get; set; }
        public int LabId { get; set; }
        public string? LabName { get; set; } // Read-only, for display
    }
}