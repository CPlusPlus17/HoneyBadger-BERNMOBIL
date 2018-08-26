using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.WebSockets;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Bernmobil.Interfaces;
using Bernmobil.InternalServices;
using Bernmobil.Models;
using mhcc.app.dataprovider.model.tdiinterface.dstructs;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace Bernmobil.Middleware
{
    public class WebSocketMiddleware
    {
        private readonly RequestDelegate _next;

        public WebSocketMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, IBernmobilService bernmobilService)
        {
            if (!context.WebSockets.IsWebSocketRequest)
                return;

            var socket = await context.WebSockets.AcceptWebSocketAsync();

            Thread sender = new Thread(() => StartSending(socket, bernmobilService));
            sender.Start();

            var runInvoke = true;

            while (runInvoke)
            {
                try
                {
                    var buffer = new byte[4096];
                    var received = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                    if (received.MessageType == WebSocketMessageType.Close)
                    {
                        runInvoke = false;
                        sender.Interrupt();
                        return;
                    }
                }
                catch(Exception ex)
                {

                }
            }

            //TODO - investigate the Kestrel exception thrown when this is the last middleware
            //await _next.Invoke(context);
        }

        private async Task StartSending(WebSocket socket, IBernmobilService bernmobilService)
        {

            bool keepRunning = true;

            while (keepRunning)
            {
                var vehiclesGeoJson = await bernmobilService.GetVehicles();
                var geoJsonString = JsonConvert.SerializeObject(vehiclesGeoJson);
                try
                {
                    Thread.Sleep(500);

                    await socket.SendAsync(new ArraySegment<byte>(Encoding.UTF8.GetBytes(geoJsonString)), WebSocketMessageType.Text, true,
                        default(CancellationToken));

                }
                catch (Exception ex)
                {
                    keepRunning = false;
                    Thread.CurrentThread.Join();
                    break;
                }
                
            }
        }

        private byte[] ObjectToByteArray(Object obj)
        {
            BinaryFormatter bf = new BinaryFormatter();
            using (var ms = new MemoryStream())
            {
                bf.Serialize(ms, obj);
                return ms.ToArray();
            }
        }
    }
}
