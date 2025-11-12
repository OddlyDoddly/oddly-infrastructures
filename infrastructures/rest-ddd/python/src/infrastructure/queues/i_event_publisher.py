"""
Event Publisher Interface
Abstraction for publishing domain events to message queue.
"""
from abc import ABC, abstractmethod
from typing import TypeVar, Generic
from domain.events.base_domain_event import BaseDomainEvent

TEvent = TypeVar('TEvent', bound=BaseDomainEvent)


class IEventPublisher(ABC, Generic[TEvent]):
    """
    Interface for publishing domain events.
    
    Rules:
    - Abstraction over message queue (RabbitMQ, Kafka, AWS SQS, etc.)
    - Used for subdomain-to-subdomain communication
    - Topic naming: {subdomain}.{action} (e.g., user.created)
    """
    
    @abstractmethod
    async def publish_async(
        self,
        p_event: TEvent,
        p_topic: str
    ) -> None:
        """
        Publish event to specified topic.
        
        Args:
            p_event: Domain event to publish
            p_topic: Topic/queue name (format: {subdomain}.{action})
        """
        pass
    
    @abstractmethod
    async def publish_batch_async(
        self,
        p_events: list[TEvent],
        p_topic: str
    ) -> None:
        """
        Publish multiple events to specified topic.
        
        Args:
            p_events: List of domain events to publish
            p_topic: Topic/queue name
        """
        pass


# Example implementation template:
"""
import json
from typing import Any
import aio_pika  # For RabbitMQ

class RabbitMQEventPublisher(IEventPublisher):
    def __init__(self, p_connection_string: str):
        self._connection_string = p_connection_string
        self._connection = None
        self._channel = None
    
    async def connect(self) -> None:
        self._connection = await aio_pika.connect_robust(
            self._connection_string
        )
        self._channel = await self._connection.channel()
    
    async def publish_async(
        self,
        p_event: BaseDomainEvent,
        p_topic: str
    ) -> None:
        if not self._channel:
            await self.connect()
        
        # Declare exchange
        exchange = await self._channel.declare_exchange(
            name='domain_events',
            type=aio_pika.ExchangeType.TOPIC,
            durable=True
        )
        
        # Serialize event
        message_body = json.dumps(p_event.to_dict())
        
        # Publish message
        await exchange.publish(
            aio_pika.Message(
                body=message_body.encode(),
                content_type='application/json',
                delivery_mode=aio_pika.DeliveryMode.PERSISTENT
            ),
            routing_key=p_topic
        )
    
    async def publish_batch_async(
        self,
        p_events: list[BaseDomainEvent],
        p_topic: str
    ) -> None:
        for event in p_events:
            await self.publish_async(event, p_topic)
    
    async def close(self) -> None:
        if self._connection:
            await self._connection.close()
"""
