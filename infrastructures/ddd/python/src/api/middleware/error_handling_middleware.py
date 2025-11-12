"""
Middleware for handling exceptions and converting them to standard error responses.
MUST be applied LAST in the middleware chain (outermost).
"""

import traceback
from datetime import datetime
from typing import Awaitable, Callable
from api.dto.responses.error_response_dto import ErrorResponseDto
from application.errors.infra import ServiceException


class ErrorHandlingMiddleware:
    """
    Middleware for centralized error handling.
    
    This middleware:
    - Catches all exceptions
    - Maps ServiceException to appropriate HTTP status
    - Returns standard ErrorResponseDto
    - Logs errors
    - MUST NOT leak internal details in production
    
    Status code mapping:
    - NOT_FOUND → 404
    - CONFLICT → 409
    - VALIDATION_FAILED → 400
    - UNAUTHORIZED → 401
    - FORBIDDEN → 403
    - Unknown → 500
    
    FastAPI implementation:
    ```python
    from fastapi import Request, status
    from fastapi.responses import JSONResponse
    from starlette.middleware.base import BaseHTTPMiddleware
    
    class ErrorHandlingMiddleware(BaseHTTPMiddleware):
        async def dispatch(self, request: Request, call_next):
            try:
                return await call_next(request)
            except ServiceException as ex:
                status_code = self._map_error_code_to_status(ex.error_code)
                
                error_response = ErrorResponseDto(
                    code=ex.error_code.value,
                    message=str(ex),
                    timestamp=datetime.utcnow(),
                    path=str(request.url.path),
                    request_id=request.state.correlation_id,
                    details=ex.details
                )
                
                return JSONResponse(
                    status_code=status_code,
                    content=error_response.__dict__
                )
            except Exception as ex:
                # Log unexpected errors
                print(f"Unexpected error: {ex}")
                traceback.print_exc()
                
                error_response = ErrorResponseDto(
                    code="INTERNAL_ERROR",
                    message="An unexpected error occurred",
                    timestamp=datetime.utcnow(),
                    path=str(request.url.path),
                    request_id=request.state.correlation_id
                )
                
                return JSONResponse(
                    status_code=500,
                    content=error_response.__dict__
                )
    ```
    
    Flask implementation:
    ```python
    from flask import request, jsonify, g
    
    @app.errorhandler(ServiceException)
    def handle_service_exception(error):
        status_code = _map_error_code_to_status(error.error_code)
        
        error_response = ErrorResponseDto(
            code=error.error_code.value,
            message=str(error),
            timestamp=datetime.utcnow(),
            path=request.path,
            request_id=g.correlation_id,
            details=error.details
        )
        
        return jsonify(error_response.__dict__), status_code
    
    @app.errorhandler(Exception)
    def handle_unexpected_exception(error):
        print(f"Unexpected error: {error}")
        traceback.print_exc()
        
        error_response = ErrorResponseDto(
            code="INTERNAL_ERROR",
            message="An unexpected error occurred",
            timestamp=datetime.utcnow(),
            path=request.path,
            request_id=g.correlation_id
        )
        
        return jsonify(error_response.__dict__), 500
    ```
    """
    
    async def __call__(
        self,
        p_request: any,
        p_call_next: Callable[[any], Awaitable[any]]
    ) -> any:
        """
        Process the request with error handling.
        
        Args:
            p_request: The HTTP request
            p_call_next: The next middleware/handler
            
        Returns:
            The HTTP response or error response
        """
        try:
            return await p_call_next(p_request)
            
        except ServiceException as ex:
            # Map service exception to HTTP response
            status_code = self._map_error_code_to_status(ex.error_code)
            
            error_response = ErrorResponseDto(
                code=ex.error_code.value,
                message=str(ex),
                timestamp=datetime.utcnow(),
                path="",  # Get from request
                request_id="",  # Get from request state
                details=ex.details
            )
            
            # Return error response (framework-specific)
            # return JSONResponse(status_code=status_code, content=error_response)
            return error_response
            
        except Exception as ex:
            # Log unexpected errors
            print(f"Unexpected error: {ex}")
            traceback.print_exc()
            
            error_response = ErrorResponseDto(
                code="INTERNAL_ERROR",
                message="An unexpected error occurred",
                timestamp=datetime.utcnow(),
                path="",  # Get from request
                request_id=""  # Get from request state
            )
            
            # Return 500 error response
            # return JSONResponse(status_code=500, content=error_response)
            return error_response
    
    @staticmethod
    def _map_error_code_to_status(p_code: any) -> int:
        """
        Maps error codes to HTTP status codes.
        
        Args:
            p_code: The error code
            
        Returns:
            The HTTP status code
        """
        # Map common error codes
        code_str = str(p_code.value).upper() if hasattr(p_code, 'value') else str(p_code).upper()
        
        if "NOT_FOUND" in code_str:
            return 404
        elif "CONFLICT" in code_str or "ALREADY_EXISTS" in code_str:
            return 409
        elif "VALIDATION" in code_str:
            return 400
        elif "UNAUTHORIZED" in code_str:
            return 401
        elif "FORBIDDEN" in code_str:
            return 403
        else:
            return 500
