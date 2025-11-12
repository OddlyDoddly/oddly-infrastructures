using System;

namespace OddlyDdd.Api.Dto.V1
{
    /// <summary>
    /// Example response DTO for returning example data.
    /// Response DTOs:
    /// - Live in /Api/Dto/
    /// - Have Response suffix
    /// - Used for HTTP transport only
    /// - NO business logic
    /// - Mapped from ReadEntity (queries) or BMO (commands)
    /// </summary>
    public class ExampleResponse : BaseResponseDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string OwnerId { get; set; } = string.Empty;
        public string OwnerName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public string DisplayName { get; set; } = string.Empty;
        public string StatusText { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
