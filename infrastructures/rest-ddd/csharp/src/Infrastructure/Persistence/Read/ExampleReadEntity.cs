/**
 * Example Read Entity - For Queries
 * Denormalized view optimized for front-end.
 * MUST suffix with 'ReadEntity'.
 */

using System;

namespace Infrastructure.Persistence.Read
{
    public class ExampleReadEntity : BaseReadEntity
    {
        /**
         * Read Entity for query operations (SELECT).
         * 
         * Rules:
         * - Located in /Infrastructure/Persistence/Read/
         * - Suffix with 'ReadEntity'
         * - Denormalized for query performance
         * - May aggregate from multiple WriteEntities
         * - NO version tracking (read-only)
         */

        private string _name;
        private string _description;
        private string _status;
        private string _ownerId;
        private string _ownerName;  // Denormalized from User
        private string _createdAt;
        private string _updatedAt;

        public ExampleReadEntity(
            string p_id,
            string p_name,
            string p_description,
            string p_status,
            string p_ownerId,
            string p_ownerName,
            string p_createdAt,
            string p_updatedAt
        )
        {
            _id = p_id;
            _name = p_name;
            _description = p_description;
            _status = p_status;
            _ownerId = p_ownerId;
            _ownerName = p_ownerName;
            _createdAt = p_createdAt;
            _updatedAt = p_updatedAt;
        }

        // Properties (read-only)
        public string Name => _name;
        public string Description => _description;
        public string Status => _status;
        public string OwnerId => _ownerId;
        public string OwnerName => _ownerName;
        public string CreatedAt => _createdAt;
        public string UpdatedAt => _updatedAt;
    }
}
