"""
Request DTO for creating an example.
Request DTOs:
- Live in /api/dto/requests/
- Have Request suffix
- Handle HTTP transport only
- Validation annotations for edge validation
"""

from dataclasses import dataclass
from typing import Optional
from api.dto.infra import BaseRequestDto


@dataclass
class CreateExampleRequest(BaseRequestDto):
    """
    Request DTO for creating a new example.
    
    In a real application, this would include validation:
    - Pydantic: Field validators
    - FastAPI: Pydantic models
    - Flask: Marshmallow schemas
    - Django: Serializers
    
    Example with Pydantic:
    ```python
    from pydantic import BaseModel, Field, validator
    
    class CreateExampleRequest(BaseModel):
        name: str = Field(..., min_length=1, max_length=100)
        description: str = Field(default="", max_length=500)
        
        @validator('name')
        def name_not_empty(cls, v):
            if not v.strip():
                raise ValueError('Name cannot be empty')
            return v
    ```
    """
    
    name: str = ""
    description: str = ""
    
    def validate(self) -> None:
        """
        Validates the request DTO (edge validation).
        
        Raises:
            ValueError: If validation fails
        """
        if not self.name or not self.name.strip():
            raise ValueError("Name is required")
        
        if len(self.name) > 100:
            raise ValueError("Name cannot exceed 100 characters")
        
        if len(self.description) > 500:
            raise ValueError("Description cannot exceed 500 characters")
