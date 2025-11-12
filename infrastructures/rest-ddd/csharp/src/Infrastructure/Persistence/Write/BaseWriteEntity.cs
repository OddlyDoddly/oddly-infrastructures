/**
 * Base Write Entity - For Commands (CREATE, UPDATE, DELETE)
 * Used when business logic executes against data.
 * Contains all fields needed for business operations.
 */

using System;

namespace Infrastructure.Persistence.Write
{
    public abstract class BaseWriteEntity
    {
        /**
         * Abstract base class for all Write Entities (Command side).
         * 
         * Rules:
         * - MUST be in /Infrastructure/Persistence/Write/
         * - MUST suffix with 'WriteEntity'
         * - Contains ORM/database attributes
         * - Used for commands that modify data
         * - Contains version for optimistic locking
         */

        protected string? _id;
        protected int _version;
        protected DateTime _createdAt;
        protected DateTime _updatedAt;

        protected BaseWriteEntity()
        {
            _version = 1;
            _createdAt = DateTime.UtcNow;
            _updatedAt = DateTime.UtcNow;
        }

        public string? Id
        {
            get => _id;
            set => _id = value;
        }

        public int Version
        {
            get => _version;
            set => _version = value;
        }

        public DateTime CreatedAt => _createdAt;

        public DateTime UpdatedAt
        {
            get => _updatedAt;
            set => _updatedAt = value;
        }

        /**
         * Increment version for optimistic locking.
         */
        public void IncrementVersion()
        {
            _version++;
            _updatedAt = DateTime.UtcNow;
        }
    }
}
