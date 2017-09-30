using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace SalesMonitoring.Models
{
    public class SalesMonth
    {
        public int id { get; set; }
        public Nullable<int> Month { get; set; }
        public string Super { get; set; }
        public string Agent { get; set; }
        public string Customer { get; set; }
        public string Ware { get; set; }
        public string Channel { get; set; }
        public Nullable<decimal> QuantSale { get; set; }
        public Nullable<decimal> SumSale { get; set; }
        public Nullable<decimal> SumInvoice { get; set; }
        [ForeignKey("Super")]
        public virtual Super Supers { get; set; }
        [ForeignKey("Agent")]
        public virtual Agent Agents { get; set; }
        [ForeignKey("Customer")]
        public virtual Kontragent Kontragents { get; set; }
        [ForeignKey("Ware")]
        public virtual Ware Wares { get; set; }
    }
}
