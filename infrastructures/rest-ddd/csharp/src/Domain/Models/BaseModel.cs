/**
 * Base Model (BMO) - Business Model Object
 * Pure business logic with NO database attributes.
 * All domain models MUST inherit from this base class.
 */

using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public abstract class BaseModel
    {
        /**
         * Abstract base class for all Business Model Objects (BMOs).
         * 
         * Rules:
         * - NO database/persistence attributes
         * - Contains business logic and invariants
         * - Validates business rules
         * - Member fields prefixed with m_ or _
         */

        /**
         * Validate business invariants.
         * Throws exception if invalid.
         */
        public abstract void Validate();

        /**
         * Convert model to dictionary representation.
         * Used by mappers for transformation.
         */
        public abstract Dictionary<string, object> ToDictionary();
    }
}
