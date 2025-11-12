/**
 * Example Service Exception
 * Follows ServiceException pattern with error codes.
 */

using System.Collections.Generic;

namespace Application.Errors
{
    public enum ExampleErrorCode
    {
        NotFound,
        ValidationFailed,
        Conflict,
        Forbidden
    }

    public class ExampleServiceException : ServiceException<ExampleErrorCode>
    {
        /**
         * Service exception for Example operations.
         * 
         * Rules:
         * - Located in /Application/Errors/
         * - Pattern: {Object}ServiceException
         * - Define error codes as enum
         * - Define message templates
         */

        private static readonly IReadOnlyDictionary<string, string> MESSAGE_TEMPLATES =
            new Dictionary<string, string>
            {
                { nameof(ExampleErrorCode.NotFound), "Example '{id}' not found" },
                { nameof(ExampleErrorCode.ValidationFailed), "Validation failed: {reason}" },
                { nameof(ExampleErrorCode.Conflict), "Example '{id}' already exists" },
                { nameof(ExampleErrorCode.Forbidden), "Access to Example '{id}' is forbidden" }
            };

        public ExampleServiceException(
            ExampleErrorCode p_errorCode,
            IReadOnlyDictionary<string, object>? p_details = null
        ) : base(p_errorCode, MESSAGE_TEMPLATES, p_details)
        {
        }

        /**
         * Map error code to HTTP status code.
         */
        public static int ToHttpStatus(ExampleErrorCode p_errorCode)
        {
            return p_errorCode switch
            {
                ExampleErrorCode.NotFound => 404,
                ExampleErrorCode.ValidationFailed => 400,
                ExampleErrorCode.Conflict => 409,
                ExampleErrorCode.Forbidden => 403,
                _ => 500
            };
        }
    }
}
