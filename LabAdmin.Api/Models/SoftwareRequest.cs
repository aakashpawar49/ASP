using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LabAdmin.Api.Models
{
    [Table("softwarerequests")]
    public class SoftwareRequest
    {
        [Key]
        public int SoftwareRequestId { get; set; }
        public int DeviceId { get; set; }
        public int RequestedBy { get; set; }
        public string SoftwareName { get; set; }
        public string Version { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        [ForeignKey("DeviceId")]
        public virtual Device Device { get; set; }

        [ForeignKey("RequestedBy")]
        public virtual User Requester { get; set; }
    }
}