"""
Base Controller
HTTP endpoints only. Map DTOs. NO business logic.
"""
from abc import ABC


class BaseController(ABC):
    """
    Abstract base class for all controllers.
    
    Rules:
    - HTTP layer ONLY
    - Bind, validate, authorize
    - Map DTOs ↔ service layer
    - NO business logic
    - Located in /api/controllers/
    """
    
    pass


# Example usage template with FastAPI:
"""
from fastapi import APIRouter, Depends, HTTPException, Request
from api.dto.feature_request import CreateFeatureRequest
from api.dto.feature_response import FeatureResponse
from application.services.i_feature_service import IFeatureService
from application.mappers.feature_mapper import FeatureMapper
from application.errors.feature_service_exception import (
    FeatureServiceException,
    FeatureErrorCode
)

class FeatureController(BaseController):
    def __init__(self):
        self.router = APIRouter(prefix='/api/v1/features', tags=['features'])
        self._setup_routes()
    
    def _setup_routes(self):
        self.router.add_api_route(
            '/',
            self.create,
            methods=['POST'],
            response_model=FeatureResponse,
            status_code=201
        )
        self.router.add_api_route(
            '/{id}',
            self.get_by_id,
            methods=['GET'],
            response_model=FeatureResponse
        )
    
    async def create(
        self,
        request: CreateFeatureRequest,
        service: IFeatureService = Depends(get_feature_service),
        mapper: FeatureMapper = Depends(get_feature_mapper)
    ) -> FeatureResponse:
        try:
            # Map DTO → Model
            model = mapper.to_model_from_request(request)
            
            # Call service
            feature_id = await service.create_async(model)
            
            # Get created entity
            entity = await service.get_by_id_async(feature_id)
            
            # Map Entity → Response
            return mapper.to_response_from_read_entity(entity)
            
        except FeatureServiceException as e:
            raise HTTPException(
                status_code=self._map_error_code_to_status(e.error_code),
                detail=e.message
            )
    
    async def get_by_id(
        self,
        id: str,
        service: IFeatureService = Depends(get_feature_service),
        mapper: FeatureMapper = Depends(get_feature_mapper)
    ) -> FeatureResponse:
        try:
            entity = await service.get_by_id_async(id)
            
            if not entity:
                raise FeatureServiceException(
                    FeatureErrorCode.NOT_FOUND,
                    {'id': id}
                )
            
            return mapper.to_response_from_read_entity(entity)
            
        except FeatureServiceException as e:
            raise HTTPException(
                status_code=self._map_error_code_to_status(e.error_code),
                detail=e.message
            )
    
    @staticmethod
    def _map_error_code_to_status(p_error_code) -> int:
        # Status code mapping
        mapping = {
            'NOT_FOUND': 404,
            'CONFLICT': 409,
            'VALIDATION_FAILED': 400,
            'UNAUTHORIZED': 401,
            'FORBIDDEN': 403
        }
        return mapping.get(p_error_code.name, 500)
"""
