"""
Base Response DTOs
Standard HTTP response contracts.
"""
from dataclasses import dataclass
from typing import Optional, Dict, Any
from datetime import datetime


@dataclass
class BaseResponse:
    """Base response DTO for successful operations."""
    pass


@dataclass
class ErrorResponse:
    """
    Standard error response contract.
    
    Rules:
    - MUST follow this structure for all errors
    - Status code mapping handled by middleware
    - NO internal details leaked in production
    """
    code: str  # Error code from enum
    message: str  # Human-readable message
    timestamp: str  # ISO 8601
    path: str  # Request path
    request_id: str  # Correlation ID
    details: Optional[Dict[str, Any]] = None  # Optional structured details
    
    @staticmethod
    def create(
        p_code: str,
        p_message: str,
        p_path: str,
        p_request_id: str,
        p_details: Optional[Dict[str, Any]] = None
    ) -> 'ErrorResponse':
        """Create error response with timestamp."""
        return ErrorResponse(
            code=p_code,
            message=p_message,
            timestamp=datetime.utcnow().isoformat() + 'Z',
            path=p_path,
            request_id=p_request_id,
            details=p_details
        )


@dataclass
class PaginatedResponse(BaseResponse):
    """
    Base response for paginated queries.
    """
    items: list
    page: int
    page_size: int
    total_count: int
    total_pages: int
    
    @property
    def has_next(self) -> bool:
        return self.page < self.total_pages
    
    @property
    def has_previous(self) -> bool:
        return self.page > 1
