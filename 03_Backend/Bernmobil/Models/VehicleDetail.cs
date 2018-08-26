using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bernmobil.Models
{
    public class VehicleDetail
    {
        [JsonProperty(PropertyName = "Nummer")]
        public int Id { get; set; }
        public int? Sitzplätze { get; set; }
        public int? Stehplätze { get; set; }

        public string Niederflur { get; set; }

        [JsonProperty(PropertyName = "Fahrgastinfo innen akkustisch")]
        public string InfoAkkustisch { get; set; }

        [JsonProperty(PropertyName = "Fahrgastinfo innen optisch")]
        public string InfoOptisch { get; set; }

        [JsonProperty(PropertyName = "Fahrgastinfo aussen optisch")]
        public string InfoOptischAussen { get; set; }

        [JsonProperty(PropertyName = "Bezeichnung")]
        public string Beschreibung { get; set; }

        [JsonProperty(PropertyName = "Einsatz")]
        public string Linien { get; set; }

        [JsonProperty(PropertyName = "Besonderheiten")]
        public BemerkungenModel Besonderheiten { get; set; }
    }

    public class BemerkungenModel
    {
        public string Bemerkungen { get; set; }
    }
}
