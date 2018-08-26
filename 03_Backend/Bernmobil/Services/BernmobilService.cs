using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Bernmobil.Interfaces;
using Bernmobil.InternalServices;
using Bernmobil.Models;
using mhcc.app.dataprovider.model.tdiinterface.dstructs;
using ProtoBuf;
using static Bernmobil.Models.GeoJsonClasses;

namespace Bernmobil.Services
{
    public class BernmobilService : IBernmobilService
    {
        public BernmobilService()
        {

        }

        public async Task<GeoJsonClasses.GeoJson> GetVehicles()
        {
            string url = "https://tdi.bernmobil.ch:12180/tdinterface/PatternTDI";
            PatternTdiArray patterns = null;

            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Accept", "application/x-protobuf");

                //Setting up the response...         

                using (HttpResponseMessage res = await client.GetAsync(url))
                using (HttpContent content = res.Content)
                {
                    var stream = await content.ReadAsStreamAsync();
                    if (stream != null)
                    {

                        try
                        {
                            patterns = Serializer.Deserialize<PatternTdiArray>(stream);
                        }
                        catch (Exception e)
                        {
                            Console.Write(e.Message);
                        }


                    }

                }
            }

                string baseUrl = "https://tdi.bernmobil.ch:12180/tdinterface/VehicleTDI";
            //The 'using' will help to prevent memory leaks.
            //Create a new instance of HttpClient
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Accept", "application/x-protobuf");

                //Setting up the response...         

                using (HttpResponseMessage res = await client.GetAsync(baseUrl))
                using (HttpContent content = res.Content)
                {
                    var stream = await content.ReadAsStreamAsync();
                    if (stream != null)
                    {
                        VehicleTdiArray veh;

                        try
                        {
                            veh = Serializer.Deserialize<VehicleTdiArray>(stream);

                            var geoJson = new GeoJsonClasses.GeoJson
                            {
                                type = "FeatureCollection",
                                features = new List<GeoJsonClasses.LocalFeature>(),
                            };


                            veh.vehicleTdiArrays.ForEach(x =>
                            {
                                var cord = new GeoJsonClasses.LocalGeometry();
                                cord.coordinates.Add(Convert.ToSingle(x.Longitude) / 3600000);
                                cord.coordinates.Add(Convert.ToSingle(x.Latitude) / 3600000);

                                cord.type = "Point";

                                var details = VehicleDetailsService.Instance.Details.FirstOrDefault(y => y.Id == x.VehicleNumber);

                                List<Properties> properties = null;

                                if(details != null)
                                {
                                    properties = new List<Properties> {
                                        new Properties()
                                        {
                                            id = "Beschreibung",
                                            address = details.Beschreibung
                                        },
                                        new Properties()
                                        {
                                            id = "Vehiclenumber",
                                            address = details.Id.ToString()
                                        },
                                        new Properties()
                                        {
                                            id = "Bemerkung",
                                            address = details.Besonderheiten?.Bemerkungen
                                        },
                                        new Properties()
                                        {
                                            id = "Category",
                                            address = MapCategory(x, details)
                                        },
                                        new Properties()
                                        {
                                            id = "Linie",
                                            address = patterns.patternTdiArrays.FirstOrDefault(y => y.Duid == x.PatternDuid?.Duid)?.ShortName
                                        }
                                    };
                                }

                                geoJson.features.Add(new GeoJsonClasses.LocalFeature()
                                {
                                    type = "Feature",
                                    geometry = cord,
                                    properties = properties
                                });
                            });

                            return geoJson;
                        }
                        catch (Exception e)
                        {
                            Console.Write(e.Message);
                        }


                    }

                }
            }

            return null;
        }

        private string MapCategory(VehicleTdi vehicleTdi, VehicleDetail details)
        {

            var optional = details.Niederflur == "X" ? "Niederflur" : "Oldtimer";

            switch (vehicleTdi.Category)
            {
                case 1:
                    return optional + "Tram";
                case 5:
                    return optional + "Bus";
                case 6:
                    return "Trolleybus";
                case 7:
                    return "Rapidbus";
                default:
                    return "Undefined";

            }
        }
    }
}
