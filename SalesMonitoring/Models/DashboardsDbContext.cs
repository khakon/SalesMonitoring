using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SalesMonitoring.Models
{
    public class DashboardsDbContext : DbContext
    {

        public DashboardsDbContext(DbContextOptions<DashboardsDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }

            public virtual DbSet<Super> Supers { get; set; }
            public virtual DbSet<Agent> Agents { get; set; }
            public virtual DbSet<Kontragent> Kontragents { get; set; }
            public virtual DbSet<Group> Groups { get; set; }
            public virtual DbSet<Ware> Wares { get; set; }
            public virtual DbSet<SalesMonth> SalesMonth { get; set; }
        }

    }

