/**
 * Create Example Request DTO
 * Transport layer - HTTP request body.
 */

namespace Api.Dto
{
    public class CreateExampleRequest
    {
        /**
         * Request DTO for creating an Example.
         * 
         * Rules:
         * - Located in /Api/Dto/
         * - Suffix with 'Request'
         * - Transport layer only
         * - NO business logic
         */

        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string OwnerId { get; set; } = string.Empty;
    }

    public class UpdateExampleRequest
    {
        /**
         * Request DTO for updating an Example.
         */

        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; }
    }
}
