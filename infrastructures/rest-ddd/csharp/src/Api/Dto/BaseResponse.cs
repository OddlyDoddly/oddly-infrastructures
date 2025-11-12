/**
 * Base Response DTOs
 * Standard HTTP response contracts.
 */

using System;
using System.Collections.Generic;

namespace Api.Dto
{
    public abstract class BaseResponse
    {
        /**
         * Base response DTO for successful operations.
         */
    }

    public class ErrorResponse
    {
        /**
         * Standard error response contract.
         * 
         * Rules:
         * - MUST follow this structure for all errors
         * - Status code mapping handled by middleware
         * - NO internal details leaked in production
         */

        public ErrorResponseData Error { get; set; }

        public ErrorResponse(ErrorResponseData p_error)
        {
            Error = p_error;
        }
    }

    public class ErrorResponseData
    {
        public string Code { get; set; }
        public string Message { get; set; }
        public string Timestamp { get; set; }
        public string Path { get; set; }
        public string RequestId { get; set; }
        public Dictionary<string, object>? Details { get; set; }

        public ErrorResponseData(
            string p_code,
            string p_message,
            string p_path,
            string p_requestId,
            Dictionary<string, object>? p_details = null
        )
        {
            Code = p_code;
            Message = p_message;
            Timestamp = DateTime.UtcNow.ToString("o");
            Path = p_path;
            RequestId = p_requestId;
            Details = p_details;
        }
    }

    public class PaginatedResponse<T> : BaseResponse
    {
        /**
         * Base response for paginated queries.
         */

        public List<T> Items { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }

        public PaginatedResponse(
            List<T> p_items,
            int p_page,
            int p_pageSize,
            int p_totalCount
        )
        {
            Items = p_items;
            Page = p_page;
            PageSize = p_pageSize;
            TotalCount = p_totalCount;
            TotalPages = (int)Math.Ceiling((double)p_totalCount / p_pageSize);
        }

        public bool HasNext => Page < TotalPages;
        public bool HasPrevious => Page > 1;
    }
}
