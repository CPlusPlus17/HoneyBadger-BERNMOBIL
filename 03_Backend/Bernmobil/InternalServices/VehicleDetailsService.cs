using Bernmobil.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Bernmobil.InternalServices
{    public sealed class VehicleDetailsService
    {
        private static VehicleDetailsService instance = null;
        private static readonly object padlock = new object();
        public List<VehicleDetail> Details;

        VehicleDetailsService()
        {
            using (StreamReader file = File.OpenText(@"details.json"))
            {
                JsonSerializer serializer = new JsonSerializer();
                Details = (List<VehicleDetail>)serializer.Deserialize(file, typeof(List<VehicleDetail>));
            }
        }

        public static VehicleDetailsService Instance
        {
            get
            {
                lock (padlock)
                {
                    if (instance == null)
                    {
                        instance = new VehicleDetailsService();
                    }
                    return instance;
                }
            }
        }
    }
}
