using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using OddlyDdd.Api.Dto.V1;
using OddlyDdd.Application.Errors;

namespace OddlyDdd.Api.Middleware
{
    /// <summary>
    /// Middleware for handling exceptions and mapping them to HTTP responses.
    /// MUST be applied LAST in the middleware pipeline (wraps all other middleware).
    /// Maps ServiceException error codes to appropriate HTTP status codes.
    /// MUST NOT leak internal details in production.
    /// </summary>
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;

        public ErrorHandlingMiddleware(RequestDelegate p_next, ILogger<ErrorHandlingMiddleware> p_logger)
        {
            _next = p_next;
            _logger = p_logger;
        }

        public async Task InvokeAsync(HttpContext p_context)
        {
            try
            {
                await _next(p_context);
            }
            catch (ServiceException ex)
            {
                await HandleServiceExceptionAsync(p_context, ex);
            }
            catch (Exception ex)
            {
                await HandleUnknownExceptionAsync(p_context, ex);
            }
        }

        private async Task HandleServiceExceptionAsync(HttpContext p_context, ServiceException p_exception)
        {
            _logger.LogWarning(p_exception, "Service exception occurred: {ErrorCode}", p_exception.GenericErrorCode);

            var statusCode = MapErrorCodeToStatusCode(p_exception.GenericErrorCode.ToString());
            p_context.Response.StatusCode = (int)statusCode;
            p_context.Response.ContentType = "application/json";

            var correlationId = p_context.Items["CorrelationId"]?.ToString() ?? string.Empty;

            var errorResponse = new ErrorResponseDto
            {
                Error = new ErrorDto
                {
                    Code = p_exception.GenericErrorCode.ToString(),
                    Message = p_exception.Message,
                    Details = (p_exception as dynamic)?.Details,
                    Path = p_context.Request.Path,
                    RequestId = correlationId
                }
            };

            var json = JsonSerializer.Serialize(errorResponse);
            await p_context.Response.WriteAsync(json);
        }

        private async Task HandleUnknownExceptionAsync(HttpContext p_context, Exception p_exception)
        {
            _logger.LogError(p_exception, "Unhandled exception occurred");

            p_context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            p_context.Response.ContentType = "application/json";

            var correlationId = p_context.Items["CorrelationId"]?.ToString() ?? string.Empty;

            var errorResponse = new ErrorResponseDto
            {
                Error = new ErrorDto
                {
                    Code = "InternalServerError",
                    Message = "An unexpected error occurred. Please try again later.",
                    Path = p_context.Request.Path,
                    RequestId = correlationId
                }
            };

            var json = JsonSerializer.Serialize(errorResponse);
            await p_context.Response.WriteAsync(json);
        }

        private HttpStatusCode MapErrorCodeToStatusCode(string p_errorCode)
        {
            return p_errorCode.ToLower() switch
            {
                var code when code.Contains("notfound") => HttpStatusCode.NotFound,
                var code when code.Contains("conflict") => HttpStatusCode.Conflict,
                var code when code.Contains("validation") => HttpStatusCode.BadRequest,
                var code when code.Contains("unauthorized") => HttpStatusCode.Unauthorized,
                var code when code.Contains("forbidden") => HttpStatusCode.Forbidden,
                _ => HttpStatusCode.InternalServerError
            };
        }
    }
}
