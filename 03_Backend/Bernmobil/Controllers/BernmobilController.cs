using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using Bernmobil.InternalServices;
using Bernmobil.Models;
using mhcc.app.dataprovider.model.tdiinterface.dstructs;
using Microsoft.AspNetCore.Mvc;
using ProtoBuf;

namespace Bernmobil.Controllers
{
    [Route("api/[controller]/[action]")]
    public class BernmobilController : ControllerBase
    {

        public BernmobilController()
        {

        }

        public IActionResult Test()
        {
            var cord = new GeoJsonClasses.LocalGeometry();
            cord.coordinates.Add(46.94797);
            cord.coordinates.Add(7.44745);
            cord.type = "Point";


            var geoJson = new GeoJsonClasses.GeoJson
            {
                type = "FeatureCollection",
                features = new List<GeoJsonClasses.LocalFeature>(new[] {
                    new GeoJsonClasses.LocalFeature()
                {
                    type = "Feature",
                    geometry = cord
                }
                    }),
            };

            return new JsonResult(geoJson);
        }

        public async Task<IActionResult> Test2()
        {
            
            return new JsonResult("");
        }
    }
}
