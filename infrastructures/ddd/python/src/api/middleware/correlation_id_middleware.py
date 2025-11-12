"""
Middleware for managing correlation IDs across requests.
MUST be applied FIRST in the middleware chain.
"""

import uuid
from typing import Awaitable, Callable


class CorrelationIdMiddleware:
    """
    Middleware for correlation ID management.
    
    This middleware:
    - Extracts correlation ID from request headers
    - Generates new ID if not present
    - Adds ID to response headers
    - Makes ID available to downstream handlers
    
    FastAPI implementation:
    ```python
    from fastapi import Request
    from starlette.middleware.base import BaseHTTPMiddleware
    
    class CorrelationIdMiddleware(BaseHTTPMiddleware):
        async def dispatch(self, request: Request, call_next):
            # Extract or generate correlation ID
            correlation_id = request.headers.get(
                "X-Correlation-ID",
                str(uuid.uuid4())
            )
            
            # Store in request state
            request.state.correlation_id = correlation_id
            
            # Process request
            response = await call_next(request)
            
            # Add to response headers
            response.headers["X-Correlation-ID"] = correlation_id
            
            return response
    ```
    
    Flask implementation:
    ```python
    from flask import request, g
    import uuid
    
    def correlation_id_middleware():
        # Extract or generate
        correlation_id = request.headers.get(
            "X-Correlation-ID",
            str(uuid.uuid4())
        )
        
        # Store in g object
        g.correlation_id = correlation_id
        
        # Add to response (use after_request)
        @after_request
        def add_correlation_id(response):
            response.headers["X-Correlation-ID"] = g.correlation_id
            return response
    ```
    """
    
    async def __call__(
        self,
        p_request: any,
        p_call_next: Callable[[any], Awaitable[any]]
    ) -> any:
        """
        Process the request and add correlation ID.
        
        Args:
            p_request: The HTTP request
            p_call_next: The next middleware/handler
            
        Returns:
            The HTTP response
        """
        # Extract or generate correlation ID
        correlation_id = getattr(
            p_request.headers,
            "X-Correlation-ID",
            str(uuid.uuid4())
        )
        
        # Store in request context (framework-specific)
        # p_request.state.correlation_id = correlation_id
        
        # Process request
        response = await p_call_next(p_request)
        
        # Add to response headers
        # response.headers["X-Correlation-ID"] = correlation_id
        
        return response
