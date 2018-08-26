using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Bernmobil.Middleware;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using mhcc.app.protobuf.commons;
using System.Net.Http;
using ProtoBuf;
using System.IO;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using Bernmobil.Interfaces;
using Bernmobil.Services;
using Microsoft.AspNetCore.Http;
using Bernmobil.InternalServices;

namespace Bernmobil
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        /* Add the following static method to your Program class, after the 
* Main() method.
*
* It's good practice to keep these requests asynchronous. .NET uses * async/await just like ES2017. */


        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            services.AddScoped<IBernmobilService, BernmobilService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseDeveloperExceptionPage();
                app.UseHsts();
            }

            app.UseCorsMiddleware();

            app.UseHttpsRedirection();
            app.UseMvc();

            var webSocketOptions = new WebSocketOptions()
            {
                KeepAliveInterval = TimeSpan.FromSeconds(5)
            };
            app.UseWebSockets(webSocketOptions);

            app.UseCors(x => x.AllowAnyOrigin());

            app.UseMiddleware<WebSocketMiddleware>();
        }
    }
}
