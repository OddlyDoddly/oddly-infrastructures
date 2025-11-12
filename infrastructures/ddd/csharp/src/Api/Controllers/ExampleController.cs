using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OddlyDdd.Api.Dto.V1;
using OddlyDdd.Application.Services;

namespace OddlyDdd.Api.Controllers
{
    /// <summary>
    /// Example controller demonstrating controller layer patterns.
    /// Controllers:
    /// - Live in /Api/Controllers/
    /// - Have Controller suffix
    /// - Handle HTTP only: bind, validate, authorize, map DTOs
    /// - NO business logic (delegate to services)
    /// - Use BaseController for common functionality
    /// 
    /// Middleware order (automatically applied):
    /// 1. Correlation ID → 2. Logging → 3. Authentication → 
    /// 4. Authorization/Ownership → 5. UnitOfWork → 6. Controller →
    /// 7. UnitOfWork commit/rollback → 8. Error Handling
    /// </summary>
    [Authorize]
    public class ExampleController : BaseController
    {
        private readonly IExampleService _exampleService;

        public ExampleController(IExampleService p_exampleService)
        {
            _exampleService = p_exampleService;
        }

        /// <summary>
        /// Creates a new example.
        /// POST /api/v1/example
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(string), 201)]
        [ProducesResponseType(typeof(ErrorResponseDto), 400)]
        [ProducesResponseType(typeof(ErrorResponseDto), 401)]
        public async Task<IActionResult> CreateExample([FromBody] CreateExampleRequest p_request)
        {
            // Validate request (edge validation)
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Get user ID from auth context
            var userId = GetUserId();
            var correlationId = GetCorrelationId();

            // Delegate to service (business logic happens here)
            var exampleId = await _exampleService.CreateExampleAsync(p_request, userId, correlationId);

            // Return created response
            return CreatedAtAction(
                nameof(GetExample),
                new { id = exampleId },
                exampleId
            );
        }

        /// <summary>
        /// Gets an example by ID.
        /// GET /api/v1/example/{id}
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ExampleResponse), 200)]
        [ProducesResponseType(typeof(ErrorResponseDto), 404)]
        public async Task<IActionResult> GetExample(string id)
        {
            var response = await _exampleService.GetExampleAsync(id);
            return Ok(response);
        }

        /// <summary>
        /// Lists examples with pagination.
        /// GET /api/v1/example?skip=0&take=10
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(IReadOnlyList<ExampleResponse>), 200)]
        public async Task<IActionResult> ListExamples([FromQuery] int skip = 0, [FromQuery] int take = 10)
        {
            var responses = await _exampleService.ListExamplesAsync(skip, take);
            return Ok(responses);
        }

        /// <summary>
        /// Updates an example.
        /// PUT /api/v1/example/{id}
        /// </summary>
        [HttpPut("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(typeof(ErrorResponseDto), 400)]
        [ProducesResponseType(typeof(ErrorResponseDto), 403)]
        [ProducesResponseType(typeof(ErrorResponseDto), 404)]
        public async Task<IActionResult> UpdateExample(string id, [FromBody] UpdateExampleRequest p_request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetUserId();
            await _exampleService.UpdateExampleAsync(id, p_request, userId);

            return NoContent();
        }

        /// <summary>
        /// Deletes an example.
        /// DELETE /api/v1/example/{id}
        /// </summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(typeof(ErrorResponseDto), 403)]
        [ProducesResponseType(typeof(ErrorResponseDto), 404)]
        public async Task<IActionResult> DeleteExample(string id)
        {
            var userId = GetUserId();
            await _exampleService.DeleteExampleAsync(id, userId);

            return NoContent();
        }

        /// <summary>
        /// Activates an example.
        /// POST /api/v1/example/{id}/activate
        /// </summary>
        [HttpPost("{id}/activate")]
        [ProducesResponseType(204)]
        [ProducesResponseType(typeof(ErrorResponseDto), 403)]
        [ProducesResponseType(typeof(ErrorResponseDto), 404)]
        public async Task<IActionResult> ActivateExample(string id)
        {
            var userId = GetUserId();
            await _exampleService.ActivateExampleAsync(id, userId);

            return NoContent();
        }

        /// <summary>
        /// Deactivates an example.
        /// POST /api/v1/example/{id}/deactivate
        /// </summary>
        [HttpPost("{id}/deactivate")]
        [ProducesResponseType(204)]
        [ProducesResponseType(typeof(ErrorResponseDto), 403)]
        [ProducesResponseType(typeof(ErrorResponseDto), 404)]
        public async Task<IActionResult> DeactivateExample(string id)
        {
            var userId = GetUserId();
            await _exampleService.DeactivateExampleAsync(id, userId);

            return NoContent();
        }
    }
}
