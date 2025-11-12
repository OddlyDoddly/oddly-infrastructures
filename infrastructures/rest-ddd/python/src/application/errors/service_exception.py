"""
Service Exception Base Classes
ALL service exceptions MUST follow this pattern.
Location: /application/errors/ (NOT /services/)
"""
from abc import ABC, abstractmethod
from enum import Enum
from typing import Dict, Optional, Any, Type


class ServiceException(Exception, ABC):
    """
    Abstract base class for all service exceptions.
    
    Rules:
    - Pattern: {Object}ServiceException
    - Define: {Object}ErrorCode enum (NOT strings)
    - Location: /application/errors/
    """
    
    @property
    @abstractmethod
    def generic_error_code(self) -> Enum:
        """Return the error code as an Enum."""
        pass
    
    @property
    @abstractmethod
    def error_code_type(self) -> Type[Enum]:
        """Return the error code type."""
        pass


class ServiceExceptionGeneric(ServiceException, ABC):
    """
    Generic service exception with error code and details.
    
    Template for creating specific service exceptions:
    1. Create enum: {Feature}ErrorCode
    2. Create class: {Feature}ServiceException(ServiceExceptionGeneric)
    3. Define message templates
    """
    
    def __init__(
        self,
        p_error_code: Enum,
        p_message_templates: Dict[str, str],
        p_details: Optional[Dict[str, Any]] = None
    ):
        self._error_code = p_error_code
        self._details = p_details or {}
        self._message = self._format_message(
            p_error_code,
            p_message_templates,
            p_details
        )
        super().__init__(self._message)
    
    @property
    def error_code(self) -> Enum:
        """Return the specific error code."""
        return self._error_code
    
    @property
    def generic_error_code(self) -> Enum:
        return self._error_code
    
    @property
    def error_code_type(self) -> Type[Enum]:
        return type(self._error_code)
    
    @property
    def details(self) -> Dict[str, Any]:
        """Return error details."""
        return self._details
    
    @staticmethod
    def _format_message(
        p_code: Enum,
        p_templates: Dict[str, str],
        p_details: Optional[Dict[str, Any]]
    ) -> str:
        """
        Format error message using template and details.
        """
        template = p_templates.get(p_code.name, f"Error: {p_code.name}")
        
        if p_details:
            try:
                return template.format(**p_details)
            except KeyError:
                return template
        
        return template


# Example usage template:
"""
from enum import Enum
from application.errors.service_exception import ServiceExceptionGeneric

class FeatureErrorCode(Enum):
    NOT_FOUND = "NOT_FOUND"
    VALIDATION_FAILED = "VALIDATION_FAILED"
    CONFLICT = "CONFLICT"

class FeatureServiceException(ServiceExceptionGeneric):
    _MESSAGE_TEMPLATES = {
        "NOT_FOUND": "Feature '{id}' not found",
        "VALIDATION_FAILED": "Validation failed: {reason}",
        "CONFLICT": "Feature '{id}' already exists"
    }
    
    def __init__(
        self,
        p_error_code: FeatureErrorCode,
        p_details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(p_error_code, self._MESSAGE_TEMPLATES, p_details)
"""
