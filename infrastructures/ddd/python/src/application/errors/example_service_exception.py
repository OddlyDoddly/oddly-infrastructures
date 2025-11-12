"""
Example service exception demonstrating the service exception pattern.
Pattern: {Object}ServiceException : TypedServiceException[{Object}ErrorCode]
Location: MUST be in /application/errors/ (NOT /services/)

Usage:
    raise ExampleServiceException(
        ExampleErrorCode.NOT_FOUND,
        {"id": example_id}
    )
"""

from enum import Enum
from typing import Dict, Optional
from application.errors.infra import TypedServiceException


class ExampleErrorCode(Enum):
    """
    Error codes for Example service exceptions.
    MUST be an enum, NOT strings.
    """
    NOT_FOUND = "not_found"
    VALIDATION_FAILED = "validation_failed"
    CONFLICT = "conflict"
    UNAUTHORIZED = "unauthorized"
    ALREADY_EXISTS = "already_exists"


class ExampleServiceException(TypedServiceException[ExampleErrorCode]):
    """
    Example service exception demonstrating the pattern.
    
    This exception is raised by ExampleService when business
    operations fail due to validation, authorization, or data issues.
    """
    
    _MESSAGE_TEMPLATES = {
        ExampleErrorCode.NOT_FOUND: "Example '{id}' not found",
        ExampleErrorCode.VALIDATION_FAILED: "Validation failed: {reason}",
        ExampleErrorCode.CONFLICT: "Example '{name}' already exists",
        ExampleErrorCode.UNAUTHORIZED: "You are not authorized to access example '{id}'",
        ExampleErrorCode.ALREADY_EXISTS: "Example with name '{name}' already exists"
    }
    
    def __init__(
        self,
        p_code: ExampleErrorCode,
        p_details: Optional[Dict[str, any]] = None
    ):
        """
        Initialize an ExampleServiceException.
        
        Args:
            p_code: The specific error code
            p_details: Optional structured details about the error
        """
        super().__init__(p_code, self._MESSAGE_TEMPLATES, p_details)
