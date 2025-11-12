/**
 * Service Exception Base Classes
 * ALL service exceptions MUST follow this pattern.
 * Location: /Application/Errors/ (NOT /Services/)
 */

using System;
using System.Collections.Generic;

namespace Application.Errors
{
    public abstract class ServiceException : Exception
    {
        /**
         * Abstract base class for all service exceptions.
         * 
         * Rules:
         * - Pattern: {Object}ServiceException
         * - Define: {Object}ErrorCode enum (NOT strings)
         * - Location: /Application/Errors/
         */

        public abstract Enum GenericErrorCode { get; }
        public abstract Type ErrorCodeType { get; }
    }

    public abstract class ServiceException<TErrorCode> : ServiceException
        where TErrorCode : Enum
    {
        public readonly TErrorCode ErrorCode;
        public readonly IReadOnlyDictionary<string, object>? Details;

        protected ServiceException(
            TErrorCode p_code,
            IReadOnlyDictionary<string, string> p_messageTemplates,
            IReadOnlyDictionary<string, object>? p_details = null
        ) : base(FormatMessage(p_code, p_messageTemplates, p_details))
        {
            ErrorCode = p_code;
            Details = p_details;
        }

        public override Enum GenericErrorCode => ErrorCode;

        public override Type ErrorCodeType => typeof(TErrorCode);

        private static string FormatMessage(
            TErrorCode p_code,
            IReadOnlyDictionary<string, string> p_templates,
            IReadOnlyDictionary<string, object>? p_details
        )
        {
            var codeName = p_code.ToString();
            var template = p_templates.ContainsKey(codeName)
                ? p_templates[codeName]
                : $"Error: {codeName}";

            if (p_details != null)
            {
                foreach (var kvp in p_details)
                {
                    template = template.Replace($"{{{kvp.Key}}}", kvp.Value?.ToString() ?? "");
                }
            }

            return template;
        }
    }
}
