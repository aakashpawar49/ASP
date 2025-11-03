using LabAdmin.Api.Data;
using Microsoft.EntityFrameworkCore;

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
            policy.WithOrigins("http://localhost:5173") // Your React app's URL
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