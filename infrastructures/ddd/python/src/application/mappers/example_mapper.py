"""
Example mapper demonstrating all required transformation patterns.
Mappers:
- Live in /application/mappers/
- Have Mapper suffix
- MANDATORY for all transformations between DTOs, BMOs, and Entities
- Handle mapping logic explicitly (no AutoMapper magic)
- Implementations in root (no /impl/ subdirectory)
"""

from api.dto.requests.create_example_request import CreateExampleRequest
from api.dto.requests.update_example_request import UpdateExampleRequest
from api.dto.responses.example_response import ExampleResponse
from application.mappers.infra import IMapper
from domain.models.example_model import ExampleModel
from infrastructure.persistence.read.example_read_entity import ExampleReadEntity
from infrastructure.persistence.write.example_write_entity import ExampleWriteEntity


class ExampleMapper(IMapper[CreateExampleRequest, ExampleResponse, ExampleModel, ExampleWriteEntity, ExampleReadEntity]):
    """
    Example mapper demonstrating CQRS mapping patterns.
    
    This mapper handles:
    - Request DTO → BMO (for commands)
    - BMO ↔ WriteEntity (for command persistence)
    - ReadEntity → Response DTO (for queries)
    - BMO → Response DTO (for command results)
    """
    
    def to_model_from_request(self, p_dto: CreateExampleRequest) -> ExampleModel:
        """
        Maps CreateExampleRequest → ExampleModel (Request DTO to BMO).
        Used when receiving create commands from API layer.
        
        Note: owner_id would typically come from authenticated user context.
        Controller should set this before calling mapper.
        
        Args:
            p_dto: The create request DTO
            
        Returns:
            A new ExampleModel instance
        """
        return ExampleModel.create(
            p_name=p_dto.name,
            p_description=p_dto.description,
            p_owner_id=""  # Set by controller from auth context
        )
    
    def to_write_entity(self, p_model: ExampleModel) -> ExampleWriteEntity:
        """
        Maps ExampleModel → ExampleWriteEntity (BMO to Persistence).
        Used when persisting data to database (command side).
        
        Args:
            p_model: The business model object
            
        Returns:
            A write entity for persistence
        """
        entity = ExampleWriteEntity()
        entity.id = p_model.id
        entity.name = p_model.name
        entity.description = p_model.description
        entity.owner_id = p_model.owner_id
        entity.is_active = p_model.is_active
        entity.created_at = p_model.created_at
        entity.updated_at = p_model.updated_at
        return entity
    
    def to_model_from_write_entity(self, p_entity: ExampleWriteEntity) -> ExampleModel:
        """
        Maps ExampleWriteEntity → ExampleModel (Persistence to BMO).
        Used when loading data from database for business logic.
        
        Args:
            p_entity: The write entity
            
        Returns:
            A hydrated business model object
        """
        return ExampleModel.hydrate(
            p_id=p_entity.id,
            p_name=p_entity.name,
            p_description=p_entity.description,
            p_owner_id=p_entity.owner_id,
            p_is_active=p_entity.is_active,
            p_created_at=p_entity.created_at,
            p_updated_at=p_entity.updated_at
        )
    
    def to_response_from_read_entity(self, p_entity: ExampleReadEntity) -> ExampleResponse:
        """
        Maps ExampleReadEntity → ExampleResponse (Query Result to Response DTO).
        Used for query operations - bypasses BMO in read path for performance.
        
        Args:
            p_entity: The read entity
            
        Returns:
            A response DTO
        """
        response = ExampleResponse()
        response.id = p_entity.id
        response.name = p_entity.name
        response.description = p_entity.description
        response.owner_id = p_entity.owner_id
        response.owner_name = p_entity.owner_name
        response.is_active = p_entity.is_active
        response.display_name = p_entity.display_name
        response.status_text = p_entity.status_text
        response.created_at = p_entity.created_at
        response.updated_at = p_entity.updated_at
        return response
    
    def to_response_from_model(self, p_model: ExampleModel) -> ExampleResponse:
        """
        Maps ExampleModel → ExampleResponse (BMO to Response DTO).
        Used when returning data from command operations.
        
        Args:
            p_model: The business model object
            
        Returns:
            A response DTO
        """
        response = ExampleResponse()
        response.id = p_model.id
        response.name = p_model.name
        response.description = p_model.description
        response.owner_id = p_model.owner_id
        response.owner_name = ""  # Not available in BMO, would need lookup
        response.is_active = p_model.is_active
        response.display_name = p_model.name  # Computed from model
        response.status_text = "Active" if p_model.is_active else "Inactive"
        response.created_at = p_model.created_at
        response.updated_at = p_model.updated_at
        return response
    
    def update_model_from_request(
        self,
        p_model: ExampleModel,
        p_request: UpdateExampleRequest
    ) -> None:
        """
        Maps UpdateExampleRequest → updates to ExampleModel.
        Used when receiving update commands from API layer.
        
        Args:
            p_model: The model to update
            p_request: The update request
        """
        p_model.update_details(p_request.name, p_request.description)
