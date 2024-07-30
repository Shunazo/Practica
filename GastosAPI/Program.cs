using CapaDatos;
using GastosAPI.Clases;
using GastosAPI.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



var conn = builder.Configuration.GetConnectionString("AppConnection");
builder.Services.AddDbContext<DatosFinalDefinitivoContext>(x=>x.UseSqlServer(conn));

builder.Services.AddScoped<IPersona,LogicaPersona>();
builder.Services.AddScoped<IGasto,LogicaGasto>();
builder.Services.AddScoped<ICategoria,LogicaCategoria>();
    
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(a => a.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod());
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
