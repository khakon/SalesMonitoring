using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SalesMonitoring.Models
{
    public class Super
    {
        public Super()
        {
            this.SalesMonth = new HashSet<SalesMonth>();
        }
        [Key]
        public string Code { get; set; }
        public string Descr { get; set; }
        public virtual ICollection<SalesMonth> SalesMonth { get; set; }
    }
}
