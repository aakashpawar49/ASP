using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LabAdmin.Api.Models
{
    [Table("devices")]
    public class Device
    {
        [Key]
        public int DeviceId { get; set; }
        public string DeviceName { get; set; }
        public string DeviceType { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public string SerialNumber { get; set; }
        public string Status { get; set; }
        public int LabId { get; set; }

        [ForeignKey("LabId")]
        public virtual Lab Lab { get; set; }
    }
}