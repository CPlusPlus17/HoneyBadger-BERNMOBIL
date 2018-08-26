using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Bernmobil.Models;

namespace Bernmobil.Interfaces
{
    public interface IBernmobilService
    {

        Task<GeoJsonClasses.GeoJson> GetVehicles();
    }
}
