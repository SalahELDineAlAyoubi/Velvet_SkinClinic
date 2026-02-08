using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using VelvetSkinClinic.Models;

namespace VelvetSkinClinic.Data;

public partial class VelvetSkinClinicContext : DbContext
{
    public VelvetSkinClinicContext(DbContextOptions<VelvetSkinClinicContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Client> Clients { get; set; }

    public virtual DbSet<ClientService> ClientServices { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Service> Services { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Client>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Clients__3214EC0785A6A553");

            entity.HasIndex(e => e.IsActive, "IX_Clients_IsActive");

            entity.HasIndex(e => e.Name, "IX_Clients_Name");

            entity.HasIndex(e => e.Phone, "IX_Clients_Phone");

            entity.HasIndex(e => e.ClientIdentifier, "UQ__Clients__412532D6E1921866").IsUnique();

            entity.Property(e => e.Birthday).HasMaxLength(20);
            entity.Property(e => e.ClientIdentifier).HasMaxLength(50);
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Diseases).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Notes).HasMaxLength(1000);
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.TotalPaid).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.TotalRequired).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<ClientService>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ClientSe__3214EC07C0FD7B55");

            entity.HasIndex(e => e.ClientId, "IX_ClientServices_ClientId");

            entity.HasIndex(e => new { e.ClientId, e.ServiceId }, "UQ_ClientServices").IsUnique();

            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Client).WithMany(p => p.ClientServices)
                .HasForeignKey(d => d.ClientId)
                .HasConstraintName("FK_ClientServices_Clients");

            entity.HasOne(d => d.Service).WithMany(p => p.ClientServices)
                .HasForeignKey(d => d.ServiceId)
                .HasConstraintName("FK_ClientServices_Services");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Payments__3214EC07EBB1DB0F");

            entity.HasIndex(e => e.ClientId, "IX_Payments_ClientId");

            entity.HasIndex(e => new { e.ClientId, e.PaymentNumber }, "UQ_Payments_ClientPaymentNumber").IsUnique();

            entity.Property(e => e.Amount).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

            entity.HasOne(d => d.Client).WithMany(p => p.Payments)
                .HasForeignKey(d => d.ClientId)
                .HasConstraintName("FK_Payments_Clients");
        });

        modelBuilder.Entity<Service>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Services__3214EC07DF88CBC5");

            entity.HasIndex(e => e.IsActive, "IX_Services_IsActive");

            entity.HasIndex(e => e.Name, "IX_Services_Name");

            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Price).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__users__3213E83F5B6E0A65");

            entity.ToTable("users");

            entity.HasIndex(e => e.LoginCustom, "UQ__users__7B91A6C3E12D2135").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DateOfBirth).HasColumnType("datetime");
            entity.Property(e => e.EntryDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FirstName)
                .HasMaxLength(100)
                .HasColumnName("firstName");
            entity.Property(e => e.IsActif)
                .HasDefaultValue(true)
                .HasColumnName("isActif");
            entity.Property(e => e.LastLoginDate)
                .HasColumnType("datetime")
                .HasColumnName("lastLoginDate");
            entity.Property(e => e.LastName)
                .HasMaxLength(100)
                .HasColumnName("lastName");
            entity.Property(e => e.LoginCustom)
                .HasMaxLength(50)
                .HasColumnName("loginCustom");
            entity.Property(e => e.MobileNumber)
                .HasMaxLength(20)
                .HasColumnName("mobileNumber");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .HasColumnName("passwordHash");
            entity.Property(e => e.PasswordSalt)
                .HasMaxLength(255)
                .HasColumnName("passwordSalt");
            entity.Property(e => e.RefreshToken).HasMaxLength(500);
            entity.Property(e => e.RefreshTokenExpiryTime).HasColumnType("datetime");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
