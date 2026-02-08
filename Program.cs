var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
//builder.Services.AddDbContext<GrandCompteContext>(options =>
//{
//    options.UseSqlServer(builder.Configuration.GetConnectionString("Grand_Compte"), sqlServerOptionsAction: sqlOptions =>
//    {
//        sqlOptions.CommandTimeout(60); // Set your desired timeout value in seconds
//        sqlOptions.UseCompatibilityLevel(110);
//    })
//    .ConfigureWarnings(w => w.Ignore(SqlServerEventId.SavepointsDisabledBecauseOfMARS));
//});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseAuthorization();
app.MapGet("/api", () => "running and working!");

app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();
