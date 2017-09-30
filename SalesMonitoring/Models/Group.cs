using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SalesMonitoring.Models
{
    public class Group
    {
        public string ParentId { get; set; }
        [Key]
        public string GroupId { get; set; }
        public string Name { get; set; }
        public Nullable<int> Lev { get; set; }
        public string Tree { get; set; }
    }
}
