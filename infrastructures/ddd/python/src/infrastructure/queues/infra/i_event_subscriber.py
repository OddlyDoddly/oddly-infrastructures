"""
Interface for subscribing to domain events from a message queue.
"""

from abc import ABC, abstractmethod
from typing import Awaitable, Callable, TypeVar


TEvent = TypeVar('TEvent')
EventHandler = Callable[[TEvent], Awaitable[None]]


class IEventSubscriber(ABC):
    """
    Interface for subscribing to domain events.
    
    Subscribers:
    - Listen to specific topics
    - Handle events asynchronously
    - Can trigger side effects in their subdomain
    """
    
    @abstractmethod
    async def subscribe_async(
        self,
        p_topic: str,
        p_handler: EventHandler[TEvent]
    ) -> None:
        """
        Subscribes to events on the specified topic.
        
        Args:
            p_topic: The topic to subscribe to
            p_handler: The async handler function for events
        """
        pass
