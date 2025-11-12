using System.Collections.Generic;

namespace OddlyDdd.Application.Errors
{
    /// <summary>
    /// Error codes for Example service exceptions.
    /// MUST be an enum, NOT strings.
    /// </summary>
    public enum ExampleErrorCode
    {
        NotFound,
        ValidationFailed,
        Conflict,
        Unauthorized,
        AlreadyExists
    }

    /// <summary>
    /// Example service exception demonstrating the service exception pattern.
    /// Pattern: {Object}ServiceException : ServiceException&lt;{Object}ErrorCode&gt;
    /// Location: MUST be in /Application/Errors/ (NOT /Services/)
    /// 
    /// Usage:
    /// throw new ExampleServiceException(
    ///     ExampleErrorCode.NotFound,
    ///     new Dictionary&lt;string, object&gt; { { "id", exampleId } }
    /// );
    /// </summary>
    public class ExampleServiceException : ServiceException<ExampleErrorCode>
    {
        private static readonly IReadOnlyDictionary<string, string> _messageTemplates =
            new Dictionary<string, string>
            {
                { nameof(ExampleErrorCode.NotFound), "Example '{id}' not found" },
                { nameof(ExampleErrorCode.ValidationFailed), "Validation failed: {reason}" },
                { nameof(ExampleErrorCode.Conflict), "Example '{name}' already exists" },
                { nameof(ExampleErrorCode.Unauthorized), "You are not authorized to access example '{id}'" },
                { nameof(ExampleErrorCode.AlreadyExists), "Example with name '{name}' already exists" }
            };

        public ExampleServiceException(
            ExampleErrorCode p_code,
            IReadOnlyDictionary<string, object>? p_details = null
        ) : base(p_code, _messageTemplates, p_details)
        {
        }

        public ExampleServiceException(
            ExampleErrorCode p_code,
            System.Exception p_innerException,
            IReadOnlyDictionary<string, object>? p_details = null
        ) : base(p_code, _messageTemplates, p_innerException, p_details)
        {
        }
    }
}
