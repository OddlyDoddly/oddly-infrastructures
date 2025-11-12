"""
Error response DTO following the standard contract.
MUST be used for all error responses.
"""

from dataclasses import dataclass
from datetime import datetime
from typing import Any, Dict, Optional


@dataclass
class ErrorResponseDto:
    """
    Standard error response contract.
    
    Status code mapping:
    - NOT_FOUND → 404
    - CONFLICT → 409
    - VALIDATION_FAILED → 400
    - UNAUTHORIZED → 401
    - FORBIDDEN → 403
    - Unknown → 500
    
    MUST NOT leak internal details in production.
    """
    
    code: str  # Error code from enum
    message: str  # Human-readable message
    timestamp: datetime
    path: str  # Request path
    request_id: str  # Correlation ID
    details: Optional[Dict[str, Any]] = None  # Optional structured details
    
    def __post_init__(self):
        """Initialize timestamp if not provided."""
        if self.timestamp is None:
            self.timestamp = datetime.utcnow()
