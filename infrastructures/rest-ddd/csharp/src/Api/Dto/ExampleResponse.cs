/**
 * Example Response DTO
 * Transport layer - HTTP response body.
 */

namespace Api.Dto
{
    public class ExampleResponse : BaseResponse
    {
        /**
         * Response DTO for Example.
         * 
         * Rules:
         * - Located in /Api/Dto/
         * - Suffix with 'Response'
         * - Transport layer only
         * - Optimized for front-end consumption
         */

        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string OwnerId { get; set; } = string.Empty;
        public string OwnerName { get; set; } = string.Empty;
        public string CreatedAt { get; set; } = string.Empty;
        public string UpdatedAt { get; set; } = string.Empty;
    }
}
