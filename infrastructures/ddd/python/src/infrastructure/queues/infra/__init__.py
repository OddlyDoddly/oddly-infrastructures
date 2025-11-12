"""Infrastructure abstractions for queues."""

from .i_event_publisher import IEventPublisher
from .i_event_subscriber import IEventSubscriber

__all__ = ['IEventPublisher', 'IEventSubscriber']
