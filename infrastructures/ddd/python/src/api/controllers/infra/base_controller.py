"""
Base class for all controllers.
Controllers handle HTTP only: bind, validate, authorize, map DTOs.
NO business logic in controllers.
"""

from abc import ABC
from typing import Optional


class BaseController(ABC):
    """
    Base class for all controllers.
    
    Controllers:
    - Live in /api/controllers/
    - Have Controller suffix
    - Handle HTTP only
    - NO business logic (delegate to services)
    - Use helper methods for common operations
    
    This base class would typically provide:
    - User context access (GetUserId, GetUserEmail)
    - Correlation ID access (GetCorrelationId)
    - Request validation helpers
    - Common response formatting
    
    In a real FastAPI application:
    ```python
    from fastapi import Depends, Request
    from fastapi.security import HTTPBearer
    
    class BaseController:
        def __init__(self):
            self._security = HTTPBearer()
        
        def get_user_id(self, request: Request) -> str:
            # Extract from JWT token
            token = request.headers.get("Authorization", "").replace("Bearer ", "")
            # Decode JWT and extract user_id
            return user_id
        
        def get_correlation_id(self, request: Request) -> str:
            return request.headers.get("X-Correlation-ID", "")
    ```
    
    In a real Flask application:
    ```python
    from flask import request, g
    
    class BaseController:
        def get_user_id(self) -> str:
            return g.user_id  # Set by auth middleware
        
        def get_correlation_id(self) -> str:
            return request.headers.get("X-Correlation-ID", "")
    ```
    """
    
    def get_user_id(self) -> str:
        """
        Gets the authenticated user ID from the request context.
        
        In a real application, this would:
        - Extract from JWT token
        - Get from session
        - Access from authenticated user context
        
        Returns:
            The authenticated user ID
        """
        # Placeholder - implement based on your auth mechanism
        return "user-123"
    
    def get_correlation_id(self) -> str:
        """
        Gets the correlation ID from the request context.
        
        Returns:
            The correlation ID
        """
        # Placeholder - implement based on your framework
        return "correlation-123"
    
    def validate_request(self, p_request: any) -> None:
        """
        Validates a request DTO (edge validation).
        
        Args:
            p_request: The request DTO to validate
            
        Raises:
            ValueError: If validation fails
        """
        if hasattr(p_request, 'validate'):
            p_request.validate()
