using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OddlyDdd.Api.Controllers;
using OddlyDdd.Api.Middleware;
using OddlyDdd.Application.Mappers;
using OddlyDdd.Application.Services;
using OddlyDdd.Application.Services.Impl;
using OddlyDdd.Infrastructure.Queues;
using OddlyDdd.Infrastructure.Queues.Infra;
using OddlyDdd.Infrastructure.Repositories;
using OddlyDdd.Infrastructure.Repositories.Impl;
using OddlyDdd.Infrastructure.Repositories.Infra;

namespace OddlyDdd;

/// <summary>
/// Main entry point for the Oddly DDD application.
/// Configures services, middleware pipeline, and starts the web host.
/// </summary>
public class Program
{
    public static void Main(string[] p_args)
    {
        var builder = WebApplication.CreateBuilder(p_args);

        // Add services to the container
        ConfigureServices(builder.Services);

        var app = builder.Build();

        // Configure the HTTP request pipeline
        ConfigureMiddleware(app);

        app.Run();
    }

    /// <summary>
    /// Configure dependency injection services.
    /// Registers all services, repositories, mappers, and infrastructure components.
    /// </summary>
    private static void ConfigureServices(IServiceCollection p_services)
    {
        // Add controllers
        p_services.AddControllers();

        // Add API documentation
        p_services.AddEndpointsApiExplorer();
        p_services.AddSwaggerGen();

        // Register repositories
        p_services.AddScoped<IExampleCommandRepository, ExampleCommandRepository>();
        p_services.AddScoped<IExampleQueryRepository, ExampleQueryRepository>();

        // Register Unit of Work
        p_services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Register services
        p_services.AddScoped<IExampleService, ExampleService>();

        // Register mappers (no interface, direct registration)
        p_services.AddScoped<ExampleMapper>();

        // Register event bus (singleton for in-memory implementation)
        p_services.AddSingleton<IEventPublisher, InMemoryEventBus>();
        p_services.AddSingleton<IEventSubscriber, InMemoryEventBus>();

        // Add CORS policy (configure as needed)
        p_services.AddCors(p_options =>
        {
            p_options.AddDefaultPolicy(p_policy =>
            {
                p_policy.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            });
        });

        // Add logging
        p_services.AddLogging();

        // TODO: Add database context configuration
        // Example for Entity Framework:
        // p_services.AddDbContext<ApplicationDbContext>(p_options =>
        //     p_options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

        // TODO: Add authentication/authorization services
        // p_services.AddAuthentication()
        // p_services.AddAuthorization()
    }

    /// <summary>
    /// Configure middleware pipeline.
    /// CRITICAL: Middleware order matters! Follow the exact sequence below.
    /// </summary>
    private static void ConfigureMiddleware(WebApplication p_app)
    {
        // Development-specific middleware
        if (p_app.Environment.IsDevelopment())
        {
            p_app.UseSwagger();
            p_app.UseSwaggerUI();
        }

        // MANDATORY MIDDLEWARE ORDER:
        // 1. Correlation ID - Tracks requests across services
        p_app.UseMiddleware<CorrelationIdMiddleware>();

        // 2. Logging - Request/response logging (add if implemented)
        // p_app.UseMiddleware<LoggingMiddleware>();

        // 3. Authentication - Verify user identity
        // p_app.UseAuthentication();

        // 4. Authorization/Ownership - Verify permissions and resource ownership
        // p_app.UseAuthorization();
        p_app.UseMiddleware<OwnershipMiddleware>();

        // 5. CORS (if needed)
        p_app.UseCors();

        // 6. Unit of Work - Manage database transactions
        p_app.UseMiddleware<UnitOfWorkMiddleware>();

        // 7. Error Handling - Map exceptions to HTTP responses (should wrap all)
        p_app.UseMiddleware<ErrorHandlingMiddleware>();

        // Map controllers (this is where controller actions execute)
        p_app.MapControllers();

        // Optional: Add health check endpoint
        p_app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

        // Optional: Add root endpoint
        p_app.MapGet("/", () => Results.Ok(new
        {
            application = "Oddly DDD Infrastructure",
            version = "1.0.0",
            description = "Domain-Driven Design infrastructure template with CQRS",
            documentation = "/swagger"
        }));
    }
}
