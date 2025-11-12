"""
Base class for all service-level exceptions.
All service exceptions MUST inherit from this class.
Location: MUST be in /application/errors/infra/ directory
"""

from abc import ABC, abstractmethod
from enum import Enum
from typing import Dict, Generic, Optional, Type, TypeVar


TErrorCode = TypeVar('TErrorCode', bound=Enum)


class ServiceException(Exception, ABC):
    """
    Base class for all service-level exceptions.
    
    All service exceptions MUST:
    - Inherit from this class
    - Define an error code enum
    - Use typed ServiceException[ErrorCodeEnum]
    - Live in /application/errors/
    - Follow pattern: {Object}ServiceException
    """
    
    @property
    @abstractmethod
    def generic_error_code(self) -> Enum:
        """Gets the generic error code as an Enum."""
        pass
    
    @property
    @abstractmethod
    def error_code_type(self) -> Type[Enum]:
        """Gets the type of the error code enum."""
        pass


class TypedServiceException(ServiceException, Generic[TErrorCode]):
    """
    Generic base class for typed service exceptions.
    
    Pattern: Create {Object}ServiceException(TypedServiceException[{Object}ErrorCode])
    Location: MUST be in /application/errors/ directory
    
    Usage:
        class ExampleErrorCode(Enum):
            NOT_FOUND = "not_found"
            VALIDATION_FAILED = "validation_failed"
        
        class ExampleServiceException(TypedServiceException[ExampleErrorCode]):
            _MESSAGE_TEMPLATES = {
                ExampleErrorCode.NOT_FOUND: "Example '{id}' not found",
                ExampleErrorCode.VALIDATION_FAILED: "Validation failed: {reason}"
            }
            
            def __init__(
                self,
                p_code: ExampleErrorCode,
                p_details: Optional[Dict[str, any]] = None
            ):
                super().__init__(p_code, self._MESSAGE_TEMPLATES, p_details)
    """
    
    def __init__(
        self,
        p_code: TErrorCode,
        p_message_templates: Dict[Enum, str],
        p_details: Optional[Dict[str, any]] = None
    ):
        """
        Initialize a typed service exception.
        
        Args:
            p_code: The specific error code
            p_message_templates: Dictionary mapping error codes to message templates
            p_details: Optional structured details about the error
        """
        self._error_code = p_code
        self._details = p_details or {}
        
        message = self._format_message(p_code, p_message_templates, self._details)
        super().__init__(message)
    
    @property
    def error_code(self) -> TErrorCode:
        """The specific error code for this exception."""
        return self._error_code
    
    @property
    def details(self) -> Dict[str, any]:
        """Optional structured details about the error."""
        return self._details
    
    @property
    def generic_error_code(self) -> Enum:
        """Gets the generic error code as an Enum."""
        return self._error_code
    
    @property
    def error_code_type(self) -> Type[Enum]:
        """Gets the type of the error code enum."""
        return type(self._error_code)
    
    @staticmethod
    def _format_message(
        p_code: Enum,
        p_message_templates: Dict[Enum, str],
        p_details: Dict[str, any]
    ) -> str:
        """
        Formats the exception message using the template and details.
        
        Args:
            p_code: The error code
            p_message_templates: Dictionary of message templates
            p_details: Dictionary of detail values
            
        Returns:
            The formatted message string
        """
        template = p_message_templates.get(p_code)
        
        if template is None:
            return f"Error occurred: {p_code.name}"
        
        if not p_details:
            return template
        
        message = template
        for key, value in p_details.items():
            message = message.replace(f"{{{key}}}", str(value))
        
        return message
