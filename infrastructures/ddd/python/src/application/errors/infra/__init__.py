"""Infrastructure abstractions for application errors."""

from .service_exception import ServiceException, TypedServiceException

__all__ = ['ServiceException', 'TypedServiceException']
