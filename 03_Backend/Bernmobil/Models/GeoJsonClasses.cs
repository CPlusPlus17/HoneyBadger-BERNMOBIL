using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bernmobil.Models
{
    public class GeoJsonClasses
    {
        public class LocalGeometry
        {
            public string type { get; set; }
            public List<double> coordinates { get; set; }= new List<double>();
        }

        public class Properties
        {
            public string name { get; set; }
            public string address { get; set; }
            public string id { get; set; }
        }

        public class LocalFeature
        {
            public string type { get; set; }
            public LocalGeometry geometry { get; set; }
            public List<Properties> properties { get; set; }
        }


        public class GeoJson
        {
            public string type { get; set; }
            public List<LocalFeature> features { get; set; }
        }
    }
}
