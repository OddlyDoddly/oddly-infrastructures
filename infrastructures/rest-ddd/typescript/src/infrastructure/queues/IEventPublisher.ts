/**
 * Event Publisher Interface
 * Abstraction for publishing domain events to message queue.
 */

import { BaseDomainEvent } from '../../domain/events/BaseDomainEvent';

export interface IEventPublisher {
  /**
   * Interface for publishing domain events.
   * 
   * Rules:
   * - Abstraction over message queue (RabbitMQ, Kafka, AWS SQS, etc.)
   * - Used for subdomain-to-subdomain communication
   * - Topic naming: {subdomain}.{action} (e.g., user.created)
   */

  /**
   * Publish event to specified topic.
   */
  publishAsync<TEvent extends BaseDomainEvent>(
    p_event: TEvent,
    p_topic: string
  ): Promise<void>;

  /**
   * Publish multiple events to specified topic.
   */
  publishBatchAsync<TEvent extends BaseDomainEvent>(
    p_events: TEvent[],
    p_topic: string
  ): Promise<void>;
}

// Example implementation template:
/**
 * 
 * import amqp, { Connection, Channel } from 'amqplib';
 * 
 * export class RabbitMQEventPublisher implements IEventPublisher {
 *   private _connection: Connection | null = null;
 *   private _channel: Channel | null = null;
 * 
 *   constructor(private readonly _connectionString: string) {}
 * 
 *   async connect(): Promise<void> {
 *     this._connection = await amqp.connect(this._connectionString);
 *     this._channel = await this._connection.createChannel();
 *   }
 * 
 *   async publishAsync<TEvent extends BaseDomainEvent>(
 *     p_event: TEvent,
 *     p_topic: string
 *   ): Promise<void> {
 *     if (!this._channel) {
 *       await this.connect();
 *     }
 * 
 *     const exchange = 'domain_events';
 *     await this._channel!.assertExchange(exchange, 'topic', { durable: true });
 * 
 *     const messageBody = JSON.stringify(p_event.toObject());
 * 
 *     this._channel!.publish(
 *       exchange,
 *       p_topic,
 *       Buffer.from(messageBody),
 *       { persistent: true, contentType: 'application/json' }
 *     );
 *   }
 * 
 *   async publishBatchAsync<TEvent extends BaseDomainEvent>(
 *     p_events: TEvent[],
 *     p_topic: string
 *   ): Promise<void> {
 *     for (const event of p_events) {
 *       await this.publishAsync(event, p_topic);
 *     }
 *   }
 * 
 *   async close(): Promise<void> {
 *     if (this._channel) await this._channel.close();
 *     if (this._connection) await this._connection.close();
 *   }
 * }
 */
