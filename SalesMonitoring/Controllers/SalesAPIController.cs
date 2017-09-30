using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SalesMonitoring.Models;

namespace SalesMonitoring.Controllers
{


    public class SalesAPIController : Controller
    {
        private DashboardsDbContext db;
        public SalesAPIController(DashboardsDbContext context)
        {
            db = context;
        }
        [HttpGet]
        [Route("api/sales")]
        public IActionResult Get(string product)
        {
            var month = db.SalesMonth.Max(s => s.Month);
            var result = db.SalesMonth.Where(s => s.Month == month && (product == "0" || s.Ware == product || db.Wares.Where(w => w.tree.Contains(product)).Any(w => w.code == s.Ware))).GroupBy(s => new { s.Supers.Code, s.Supers.Descr }).Select(s => new
            {
                s.Key.Code,
                super = s.Key.Descr,
                quant = s.Sum(t => t.QuantSale),
                total = s.Sum(t => t.SumSale)
            });
            return Ok(new { model = result, success = true });
        }

        [HttpGet]
        [Route("api/sales_agents")]
        public IActionResult GetAgents(string id, string product)
        {
            var month = db.SalesMonth.Max(s => s.Month);
            var result = db.SalesMonth.Where(s => s.Month == month && (s.Super == id || id == "0") && (product == "0" || s.Ware == product || db.Wares.Where(w => w.tree.Contains(product)).Any(w => w.code == s.Ware))).GroupBy(s => new { s.Agents.Code, s.Agents.Descr }).Select(s => new
            {
                s.Key.Code,
                agent = s.Key.Descr,
                quant = s.Sum(t => t.QuantSale),
                total = s.Sum(t => t.SumSale)
            });
            return Ok(new { model = result, success = true });
        }

        [HttpGet]
        [Route("api/sales_customers")]
        public IActionResult GetCustomers(string agent, string product)
        {
            var month = db.SalesMonth.Max(s => s.Month);
            var result = db.SalesMonth.Where(s => s.Month == month && s.Agent == agent && (product == "0" || s.Ware == product || db.Wares.Where(w => w.tree.Contains(product)).Any(w => w.code == s.Ware))).GroupBy(s => new { s.Kontragents.Code, s.Kontragents.Descr }).Select(s => new
            {
                s.Key.Code,
                customer = s.Key.Descr,
                quant = s.Sum(t => t.QuantSale),
                total = s.Sum(t => t.SumSale)
            });
            return Ok(new { model = result, success = true });
        }

        [HttpGet]
        [Route("api/sales_root")]
        public IActionResult GetRootGroups(string sup, string agent, string cust)
        {
            var month = db.SalesMonth.Max(s => s.Month);
            var root = db.Groups.Where(s => s.Lev == 0);
            var result = from gr in db.Groups.Where(s => s.Lev == 0)
                                from s in db.SalesMonth.Where(s => s.Month == month && (s.Super == sup || sup == "0") && (s.Agent == agent || agent == "0") && (s.Customer == cust || cust == "0") && s.Wares.tree.Contains(gr.GroupId))
                                select new { code = gr.GroupId, parent = gr.ParentId, grup = gr.Name, quant = s.QuantSale, total = s.SumSale }
                                    into grp
                                group grp by new { grp.code, grp.parent, grp.grup } into gp
                                select new { isfolder = true, code = gp.Key.code, parent = gp.Key.parent, grup = gp.Key.grup, quant = gp.Sum(s => s.quant), total = gp.Sum(s => s.total) } into t
                                where (float)t.total > 0.01 || (float)t.total < -0.01
                                select t;

            return Ok(new { model = result, success = true });
        }

        [HttpGet]
        [Route("api/sales_groups")]
        public IActionResult GetGroups(string parent, string supr, string agent, string cust)
        {
            var month = db.SalesMonth.Max(s => s.Month);
            var results = from gr in db.Groups.Where(s => s.ParentId == parent)
                          from s in db.SalesMonth.Where(s => s.Month == month && (s.Super == supr || supr == "0") && (s.Agent == agent || agent == "0") && (s.Customer == cust || cust == "0") && s.Wares.tree.Contains(gr.GroupId))
                          select new { code = gr.GroupId, parent = gr.ParentId, grup = gr.Name, quant = s.QuantSale, total = s.SumSale }
                                    into grp
                          group grp by new { grp.code, grp.parent, grp.grup } into gp
                          select new { isfolder = true, parent = gp.Key.parent, code = gp.Key.code, grup = gp.Key.grup, quant = gp.Sum(s => s.quant), total = gp.Sum(s => s.total) } into t
                          where (float)t.total > 0.01 || (float)t.total < -0.01
                          select t;
            var items = db.SalesMonth.Where(s => s.Month == month && (s.Super == supr || supr == "0") && (s.Agent == agent || agent == "0") && (s.Customer == cust || cust == "0") && s.Wares.parentCode == parent)
                .GroupBy(s => new { s.Ware, s.Wares.descr, s.Wares.parentCode }).Select(s => new
                {
                    isfolder = false,
                    parent = s.Key.parentCode,
                    code = s.Key.Ware,
                    grup = s.Key.descr,
                    quant = s.Sum(i => i.QuantSale),
                    total = s.Sum(i => i.SumSale)
                });
            var model = results.Concat(items);
            var a = items.ToList();
            return Ok(new { model = model, success = true });
        }
    }
}