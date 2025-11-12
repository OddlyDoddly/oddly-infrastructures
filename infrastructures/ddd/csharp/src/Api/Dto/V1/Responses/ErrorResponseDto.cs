using System;

namespace OddlyDdd.Api.Dto.V1.Responses
{
    /// <summary>
    /// Standard error response contract.
    /// ALL error responses MUST follow this contract.
    /// Status code mapping:
    /// - NotFound → 404
    /// - Conflict → 409
    /// - ValidationFailed → 400
    /// - Unauthorized → 401
    /// - Forbidden → 403
    /// - Unknown → 500
    /// </summary>
    public class ErrorResponseDto
    {
        public ErrorDto Error { get; set; } = null!;
    }

    public class ErrorDto
    {
        /// <summary>
        /// Error code from the service exception enum
        /// </summary>
        public string Code { get; set; } = string.Empty;

        /// <summary>
        /// Human-readable error message
        /// </summary>
        public string Message { get; set; } = string.Empty;

        /// <summary>
        /// Optional structured details about the error
        /// </summary>
        public object? Details { get; set; }

        /// <summary>
        /// ISO 8601 timestamp
        /// </summary>
        public string Timestamp { get; set; } = string.Empty;

        /// <summary>
        /// Request path where the error occurred
        /// </summary>
        public string Path { get; set; } = string.Empty;

        /// <summary>
        /// Correlation/Request ID for tracking
        /// </summary>
        public string RequestId { get; set; } = string.Empty;

        public ErrorDto()
        {
            Timestamp = DateTime.UtcNow.ToString("o");
        }
    }
}
