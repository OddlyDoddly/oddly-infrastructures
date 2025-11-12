using System.ComponentModel.DataAnnotations;

namespace OddlyDdd.Api.Dto.V1
{
    /// <summary>
    /// Example request DTO for updating an example.
    /// </summary>
    public class UpdateExampleRequest : BaseRequestDto
    {
        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        public string Name { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string Description { get; set; } = string.Empty;
    }
}
