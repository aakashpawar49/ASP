using LabAdmin.Api.Data; // Import your Data folder
using Microsoft.EntityFrameworkCore; // Import Entity Framework

var builder = WebApplication.CreateBuilder(args);

// --- Add services to the container ---

// 1. Get Connection String
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// 2. Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            // This is the URL of your React dev server
            policy.WithOrigins("http://localhost:5173") 
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// 3. Add DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// 4. Add Controllers
builder.Services.AddControllers();

// Add Swagger/OpenAPI for API testing
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- Build the App ---
var app = builder.Build();

// --- Configure the HTTP request pipeline ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 5. Use CORS (Must be before UseAuthorization)
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();
