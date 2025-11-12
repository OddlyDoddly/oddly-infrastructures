"""
Base class for all response DTOs.
Response DTOs are used for HTTP transport from server to client.
"""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class BaseResponseDto:
    """
    Base class for all response DTOs.
    
    Response DTOs:
    - Live in /api/dto/responses/
    - Have Response suffix
    - Handle HTTP transport only
    - NO business logic
    - May include metadata (timestamps, request IDs, etc.)
    """
    
    request_id: str = ""
    timestamp: datetime = None
    
    def __post_init__(self):
        """Initialize timestamp if not provided."""
        if self.timestamp is None:
            self.timestamp = datetime.utcnow()
