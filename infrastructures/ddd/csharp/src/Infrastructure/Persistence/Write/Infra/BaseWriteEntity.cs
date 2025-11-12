using System;

namespace OddlyDdd.Infrastructure.Persistence.Write.Infra
{
    /// <summary>
    /// Base class for all write entities (command side of CQRS).
    /// Write entities are used when business logic executes against data.
    /// They contain all fields needed for business operations.
    /// </summary>
    public abstract class BaseWriteEntity
    {
        /// <summary>
        /// Unique identifier for the entity
        /// </summary>
        public string Id { get; set; } = string.Empty;

        /// <summary>
        /// Version number for optimistic concurrency control
        /// </summary>
        public int? Version { get; set; }

        /// <summary>
        /// Timestamp when the entity was created
        /// </summary>
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// Timestamp when the entity was last updated
        /// </summary>
        public DateTime UpdatedAt { get; set; }

        protected BaseWriteEntity()
        {
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
