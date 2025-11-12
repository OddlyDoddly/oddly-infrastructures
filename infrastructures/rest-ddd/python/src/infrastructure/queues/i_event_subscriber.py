"""
Event Subscriber Interface
Abstraction for subscribing to domain events from message queue.
"""
from abc import ABC, abstractmethod
from typing import TypeVar, Generic, Callable, Awaitable
from domain.events.base_domain_event import BaseDomainEvent

TEvent = TypeVar('TEvent', bound=BaseDomainEvent)


class IEventSubscriber(ABC, Generic[TEvent]):
    """
    Interface for subscribing to domain events.
    
    Rules:
    - Abstraction over message queue (RabbitMQ, Kafka, AWS SQS, etc.)
    - Used for receiving events from other subdomains
    - Handler processes events asynchronously
    """
    
    @abstractmethod
    async def subscribe_async(
        self,
        p_topic: str,
        p_handler: Callable[[TEvent], Awaitable[None]]
    ) -> None:
        """
        Subscribe to events on specified topic.
        
        Args:
            p_topic: Topic/queue name (format: {subdomain}.{action})
            p_handler: Async function to handle received events
        """
        pass
    
    @abstractmethod
    async def unsubscribe_async(self, p_topic: str) -> None:
        """
        Unsubscribe from topic.
        
        Args:
            p_topic: Topic/queue name to unsubscribe from
        """
        pass


# Example implementation template:
"""
import json
import aio_pika  # For RabbitMQ
from typing import Type

class RabbitMQEventSubscriber(IEventSubscriber):
    def __init__(
        self,
        p_connection_string: str,
        p_event_type: Type[BaseDomainEvent]
    ):
        self._connection_string = p_connection_string
        self._event_type = p_event_type
        self._connection = None
        self._channel = None
        self._queue = None
    
    async def connect(self) -> None:
        self._connection = await aio_pika.connect_robust(
            self._connection_string
        )
        self._channel = await self._connection.channel()
        await self._channel.set_qos(prefetch_count=10)
    
    async def subscribe_async(
        self,
        p_topic: str,
        p_handler: Callable[[BaseDomainEvent], Awaitable[None]]
    ) -> None:
        if not self._channel:
            await self.connect()
        
        # Declare exchange
        exchange = await self._channel.declare_exchange(
            name='domain_events',
            type=aio_pika.ExchangeType.TOPIC,
            durable=True
        )
        
        # Declare queue
        queue_name = f"{p_topic}_queue"
        self._queue = await self._channel.declare_queue(
            name=queue_name,
            durable=True
        )
        
        # Bind queue to exchange with routing key
        await self._queue.bind(exchange, routing_key=p_topic)
        
        # Start consuming
        async def on_message(message: aio_pika.IncomingMessage):
            async with message.process():
                # Deserialize event
                event_dict = json.loads(message.body.decode())
                event = self._event_type(**event_dict)
                
                # Handle event
                await p_handler(event)
        
        await self._queue.consume(on_message)
    
    async def unsubscribe_async(self, p_topic: str) -> None:
        if self._queue:
            await self._queue.cancel()
    
    async def close(self) -> None:
        if self._connection:
            await self._connection.close()
"""
