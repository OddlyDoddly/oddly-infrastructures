"""Infrastructure abstractions for repositories."""

from .i_command_repository import ICommandRepository
from .i_query_repository import IQueryRepository
from .i_unit_of_work import IUnitOfWork

__all__ = ['ICommandRepository', 'IQueryRepository', 'IUnitOfWork']
