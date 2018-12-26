using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using vega.Models;

namespace vega.Controllers.Resources
{
    public class FeatureResource
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public FeatureResource()
        { 
        }
    }
}