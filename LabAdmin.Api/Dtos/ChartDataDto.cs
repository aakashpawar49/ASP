namespace LabAdmin.Api.Dtos
{
    // A generic class to hold data for charts
    // (e.g., { Name = "January", Value = 15 })
    public class ChartDataDto
    {
        public string Name { get; set; }
        public int Value { get; set; }
    }
}
