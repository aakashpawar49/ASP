using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LabAdmin.Api.Models
{
    [Table("labs")]
    public class Lab
    {
        [Key]
        public int LabId { get; set; }
        public string LabName { get; set; }
        public string Location { get; set; }
        public int? LabInchargeId { get; set; }

        [ForeignKey("LabInchargeId")]
        public virtual User LabIncharge { get; set; }
    }
}