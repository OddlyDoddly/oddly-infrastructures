using System;
using System.Collections.Generic;
using System.Linq;

namespace OddlyDdd.Application.Errors
{
    /// <summary>
    /// Base class for all service-level exceptions.
    /// All service exceptions MUST inherit from this class.
    /// </summary>
    public abstract class ServiceException : Exception
    {
        /// <summary>
        /// Gets the generic error code as an Enum
        /// </summary>
        public abstract Enum GenericErrorCode { get; }

        /// <summary>
        /// Gets the type of the error code enum
        /// </summary>
        public abstract Type ErrorCodeType { get; }

        protected ServiceException(string p_message) : base(p_message)
        {
        }

        protected ServiceException(string p_message, Exception p_innerException) 
            : base(p_message, p_innerException)
        {
        }
    }

    /// <summary>
    /// Generic base class for typed service exceptions.
    /// Pattern: Create {Object}ServiceException : ServiceException&lt;{Object}ErrorCode&gt;
    /// Location: MUST be in /Application/Errors/ directory
    /// </summary>
    /// <typeparam name="TErrorCode">The enum type representing error codes</typeparam>
    public abstract class ServiceException<TErrorCode> : ServiceException
        where TErrorCode : Enum
    {
        /// <summary>
        /// The specific error code for this exception
        /// </summary>
        public TErrorCode ErrorCode { get; }

        /// <summary>
        /// Optional structured details about the error
        /// </summary>
        public IReadOnlyDictionary<string, object>? Details { get; }

        public override Enum GenericErrorCode => ErrorCode;
        public override Type ErrorCodeType => typeof(TErrorCode);

        protected ServiceException(
            TErrorCode p_code,
            IReadOnlyDictionary<string, string> p_messageTemplates,
            IReadOnlyDictionary<string, object>? p_details = null
        ) : base(FormatMessage(p_code, p_messageTemplates, p_details))
        {
            ErrorCode = p_code;
            Details = p_details;
        }

        protected ServiceException(
            TErrorCode p_code,
            IReadOnlyDictionary<string, string> p_messageTemplates,
            Exception p_innerException,
            IReadOnlyDictionary<string, object>? p_details = null
        ) : base(FormatMessage(p_code, p_messageTemplates, p_details), p_innerException)
        {
            ErrorCode = p_code;
            Details = p_details;
        }

        /// <summary>
        /// Formats the exception message using the template and details
        /// </summary>
        protected static string FormatMessage(
            TErrorCode p_code,
            IReadOnlyDictionary<string, string> p_messageTemplates,
            IReadOnlyDictionary<string, object>? p_details)
        {
            var codeString = p_code.ToString();
            
            if (!p_messageTemplates.TryGetValue(codeString, out var template))
            {
                return $"Error occurred: {codeString}";
            }

            if (p_details == null || p_details.Count == 0)
            {
                return template;
            }

            var message = template;
            foreach (var kvp in p_details)
            {
                message = message.Replace($"{{{kvp.Key}}}", kvp.Value?.ToString() ?? "null");
            }

            return message;
        }
    }
}
