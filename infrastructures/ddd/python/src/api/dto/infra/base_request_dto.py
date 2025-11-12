"""
Base class for all request DTOs.
Request DTOs are used for HTTP transport from client to server.
"""

from dataclasses import dataclass
from typing import Optional
import uuid


@dataclass
class BaseRequestDto:
    """
    Base class for all request DTOs.
    
    Request DTOs:
    - Live in /api/dto/requests/
    - Have Request suffix
    - Handle HTTP transport only
    - NO business logic
    - Edge validation happens here
    """
    
    request_id: str = ""
    
    def __post_init__(self):
        """Initialize request ID if not provided."""
        if not self.request_id:
            self.request_id = str(uuid.uuid4())
