/**
 * Base Read Entity - For Queries (SELECT)
 * Pre-rendered views optimized for front-end.
 * Denormalized for query performance.
 */

using System;

namespace Infrastructure.Persistence.Read
{
    public abstract class BaseReadEntity
    {
        /**
         * Abstract base class for all Read Entities (Query side).
         * 
         * Rules:
         * - MUST be in /Infrastructure/Persistence/Read/
         * - MUST suffix with 'ReadEntity'
         * - Pre-rendered views optimized for queries
         * - Denormalized data (may aggregate from multiple WriteEntities)
         * - NO version tracking needed (read-only)
         */

        protected string? _id;

        public string? Id
        {
            get => _id;
            set => _id = value;
        }
    }
}
