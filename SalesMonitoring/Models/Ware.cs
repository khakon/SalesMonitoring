using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SalesMonitoring.Models
{
    public class Ware
    {
        public Ware()
        {
            this.SalesMonth = new HashSet<SalesMonth>();
        }
        public string id { get; set; }
        public string parentid { get; set; }
        public Nullable<byte> isfolder { get; set; }
        public Nullable<int> lev { get; set; }
        public string tree { get; set; }
        [Key]
        public string code { get; set; }
        public string parentCode { get; set; }
        public string descr { get; set; }
        public virtual ICollection<SalesMonth> SalesMonth { get; set; }
    }
}
