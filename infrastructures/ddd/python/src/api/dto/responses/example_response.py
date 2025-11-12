"""
Response DTO for example data.
Response DTOs:
- Live in /api/dto/responses/
- Have Response suffix
- Handle HTTP transport only
- May include computed/denormalized fields
"""

from dataclasses import dataclass
from datetime import datetime
from api.dto.infra import BaseResponseDto


@dataclass
class ExampleResponse(BaseResponseDto):
    """
    Response DTO for example data.
    
    This DTO includes both direct fields and denormalized/computed
    fields for client convenience.
    """
    
    id: str = ""
    name: str = ""
    description: str = ""
    owner_id: str = ""
    owner_name: str = ""  # Denormalized from owner
    is_active: bool = True
    display_name: str = ""  # Computed field
    status_text: str = ""  # Computed field
    created_at: datetime = None
    updated_at: datetime = None
    
    def __post_init__(self):
        """Initialize default datetime values."""
        super().__post_init__()
        if self.created_at is None:
            self.created_at = datetime.utcnow()
        if self.updated_at is None:
            self.updated_at = datetime.utcnow()
