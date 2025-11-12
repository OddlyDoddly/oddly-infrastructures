/**
 * Example Controller
 * HTTP endpoints for Example operations.
 */

using System.Collections.Generic;
using System.Threading.Tasks;
using Api.Dto;
using Application.Errors;
using Application.Mappers;
using Application.Services;

namespace Api.Controllers
{
    public class ExampleController
    {
        /**
         * Controller for Example HTTP endpoints.
         * 
         * Rules:
         * - Located in /Api/Controllers/
         * - Suffix with 'Controller'
         * - HTTP layer ONLY
         * - Bind, validate, authorize, map DTOs
         * - NO business logic
         */

        private readonly IExampleService _service;
        private readonly ExampleMapper _mapper;

        public ExampleController(
            IExampleService p_service,
            ExampleMapper p_mapper
        )
        {
            _service = p_service;
            _mapper = p_mapper;
        }

        /**
         * POST /api/v1/examples
         * Create a new Example.
         */
        public async Task<ExampleResponse> CreateAsync(
            CreateExampleRequest p_request,
            string p_userId,
            string p_requestId
        )
        {
            try
            {
                // Map DTO → Model
                var model = _mapper.ToModelFromRequest(p_request);

                // Call service
                var exampleId = await _service.CreateAsync(model);

                // Get created entity
                var entity = await _service.GetByIdAsync(exampleId);

                if (entity == null)
                {
                    throw new ExampleServiceException(
                        ExampleErrorCode.NotFound,
                        new Dictionary<string, object> { { "id", exampleId } }
                    );
                }

                // Map Entity → Response
                return _mapper.ToResponseFromReadEntity(entity);
            }
            catch (ExampleServiceException)
            {
                throw;
            }
        }

        /**
         * GET /api/v1/examples/{id}
         * Get Example by ID.
         */
        public async Task<ExampleResponse> GetByIdAsync(
            string p_id,
            string p_requestId
        )
        {
            try
            {
                var entity = await _service.GetByIdAsync(p_id);

                if (entity == null)
                {
                    throw new ExampleServiceException(
                        ExampleErrorCode.NotFound,
                        new Dictionary<string, object> { { "id", p_id } }
                    );
                }

                return _mapper.ToResponseFromReadEntity(entity);
            }
            catch (ExampleServiceException)
            {
                throw;
            }
        }

        /**
         * PUT /api/v1/examples/{id}
         * Update an Example.
         */
        public async Task<ExampleResponse> UpdateAsync(
            string p_id,
            UpdateExampleRequest p_request,
            string p_userId,
            string p_requestId
        )
        {
            try
            {
                // Get existing entity
                var existingEntity = await _service.GetByIdAsync(p_id);

                if (existingEntity == null)
                {
                    throw new ExampleServiceException(
                        ExampleErrorCode.NotFound,
                        new Dictionary<string, object> { { "id", p_id } }
                    );
                }

                // Create updated model
                var model = _mapper.ToModelFromRequest(new CreateExampleRequest
                {
                    Name = p_request.Name ?? existingEntity.Name,
                    Description = p_request.Description ?? existingEntity.Description,
                    OwnerId = existingEntity.OwnerId
                });

                // Call service
                await _service.UpdateAsync(p_id, model);

                // Get updated entity
                var updatedEntity = await _service.GetByIdAsync(p_id);

                if (updatedEntity == null)
                {
                    throw new ExampleServiceException(
                        ExampleErrorCode.NotFound,
                        new Dictionary<string, object> { { "id", p_id } }
                    );
                }

                return _mapper.ToResponseFromReadEntity(updatedEntity);
            }
            catch (ExampleServiceException)
            {
                throw;
            }
        }

        /**
         * DELETE /api/v1/examples/{id}
         * Delete an Example.
         */
        public async Task DeleteAsync(
            string p_id,
            string p_userId,
            string p_requestId
        )
        {
            try
            {
                await _service.DeleteAsync(p_id);
            }
            catch (ExampleServiceException)
            {
                throw;
            }
        }

        /**
         * GET /api/v1/examples
         * List Examples with pagination.
         */
        public async Task<List<ExampleResponse>> ListAsync(
            int p_page,
            int p_pageSize,
            string p_requestId
        )
        {
            try
            {
                var entities = await _service.ListAsync(p_page, p_pageSize);
                var responses = new List<ExampleResponse>();

                foreach (var entity in entities)
                {
                    responses.Add(_mapper.ToResponseFromReadEntity(entity));
                }

                return responses;
            }
            catch
            {
                throw;
            }
        }

        /**
         * POST /api/v1/examples/{id}/activate
         * Activate an Example.
         */
        public async Task<ExampleResponse> ActivateAsync(
            string p_id,
            string p_userId,
            string p_requestId
        )
        {
            try
            {
                await _service.ActivateAsync(p_id);

                var entity = await _service.GetByIdAsync(p_id);

                if (entity == null)
                {
                    throw new ExampleServiceException(
                        ExampleErrorCode.NotFound,
                        new Dictionary<string, object> { { "id", p_id } }
                    );
                }

                return _mapper.ToResponseFromReadEntity(entity);
            }
            catch (ExampleServiceException)
            {
                throw;
            }
        }

        /**
         * POST /api/v1/examples/{id}/deactivate
         * Deactivate an Example.
         */
        public async Task<ExampleResponse> DeactivateAsync(
            string p_id,
            string p_userId,
            string p_requestId
        )
        {
            try
            {
                await _service.DeactivateAsync(p_id);

                var entity = await _service.GetByIdAsync(p_id);

                if (entity == null)
                {
                    throw new ExampleServiceException(
                        ExampleErrorCode.NotFound,
                        new Dictionary<string, object> { { "id", p_id } }
                    );
                }

                return _mapper.ToResponseFromReadEntity(entity);
            }
            catch (ExampleServiceException)
            {
                throw;
            }
        }
    }
}
