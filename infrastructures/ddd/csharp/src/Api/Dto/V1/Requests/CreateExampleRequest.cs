using System.ComponentModel.DataAnnotations;
using OddlyDdd.Api.Dto.V1.Infra;

namespace OddlyDdd.Api.Dto.V1.Requests
{
    /// <summary>
    /// Example request DTO for creating an example.
    /// Request DTOs:
    /// - Live in /Api/Dto/
    /// - Have Request suffix
    /// - Used for HTTP transport only
    /// - NO business logic
    /// - Can have validation attributes for edge validation
    /// </summary>
    public class CreateExampleRequest : BaseRequestDto
    {
        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        public string Name { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string Description { get; set; } = string.Empty;
    }
}
