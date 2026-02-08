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

    public virtual DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
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
