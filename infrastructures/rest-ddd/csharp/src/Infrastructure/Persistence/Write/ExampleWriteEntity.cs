/**
 * Example Write Entity - For Commands
 * Contains ORM/database attributes.
 * MUST suffix with 'WriteEntity'.
 */

using System;

namespace Infrastructure.Persistence.Write
{
    public class ExampleWriteEntity : BaseWriteEntity
    {
        /**
         * Write Entity for command operations (CREATE, UPDATE, DELETE).
         * 
         * Rules:
         * - Located in /Infrastructure/Persistence/Write/
         * - Suffix with 'WriteEntity'
         * - Contains database/ORM attributes
         * - Used for business operations
         */

        private string _name;
        private string _description;
        private string _status;
        private string _ownerId;

        public ExampleWriteEntity(
            string p_name,
            string p_description,
            string p_status,
            string p_ownerId
        )
        {
            _name = p_name;
            _description = p_description;
            _status = p_status;
            _ownerId = p_ownerId;
        }

        // Properties
        public string Name
        {
            get => _name;
            set => _name = value;
        }

        public string Description
        {
            get => _description;
            set => _description = value;
        }

        public string Status
        {
            get => _status;
            set => _status = value;
        }

        public string OwnerId
        {
            get => _ownerId;
            set => _ownerId = value;
        }
    }
}
