using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace CapaDatos;

public partial class DatosFinalDefinitivoContext : DbContext
{
    public DatosFinalDefinitivoContext()
    {
    }

    public DatosFinalDefinitivoContext(DbContextOptions<DatosFinalDefinitivoContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Categoria> Categorias { get; set; }

    public virtual DbSet<Gasto> Gastos { get; set; }

    public virtual DbSet<Persona> Personas { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Categoria>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Categori__3214EC2766E5A5C1");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Descripcion).HasMaxLength(255);
            entity.Property(e => e.MontoLimite).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Nombre).HasMaxLength(100);
            entity.Property(e => e.PersonaNombre).HasMaxLength(100);
        });

        modelBuilder.Entity<Gasto>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Gastos__3214EC270BB8F3FF");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Cantidad).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CategoriaNombre).HasMaxLength(100);
            entity.Property(e => e.Descripcion).HasMaxLength(255);
            entity.Property(e => e.Nombre).HasMaxLength(100);
            entity.Property(e => e.PersonaNombre).HasMaxLength(100);
        });

        modelBuilder.Entity<Persona>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Persona__3214EC27D2E885C2");

            entity.ToTable("Persona");

            entity.HasIndex(e => e.Email, "UQ__Persona__A9D105349AA006E4").IsUnique();

            entity.HasIndex(e => e.Usuario, "UQ__Persona__E3237CF7DCC8D242").IsUnique();

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Contrasena).HasMaxLength(100);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.Usuario).HasMaxLength(100);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
