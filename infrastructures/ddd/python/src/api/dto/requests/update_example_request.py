"""Request DTO for updating an example."""

from dataclasses import dataclass
from api.dto.infra import BaseRequestDto


@dataclass
class UpdateExampleRequest(BaseRequestDto):
    """Request DTO for updating an existing example."""
    
    name: str = ""
    description: str = ""
    
    def validate(self) -> None:
        """
        Validates the request DTO.
        
        Raises:
            ValueError: If validation fails
        """
        if not self.name or not self.name.strip():
            raise ValueError("Name is required")
        
        if len(self.name) > 100:
            raise ValueError("Name cannot exceed 100 characters")
        
        if len(self.description) > 500:
            raise ValueError("Description cannot exceed 500 characters")
