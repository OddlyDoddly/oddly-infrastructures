package com.oddly.ddd.infrastructure.repositories;

import com.oddly.ddd.domain.models.ExampleModel;
import com.oddly.ddd.infrastructure.repositories.infra.ICommandRepository;

/**
 * Command repository interface for Example domain.
 * Command repositories:
 * - Live in /infrastructure/repositories/
 * - Have ICommandRepository suffix
 * - Implementations go in /infrastructure/repositories/impl/
 * - Work with WriteEntities and receive BMOs
 * - Handle mapping from BMO to WriteEntity internally
 */
public interface IExampleCommandRepository extends ICommandRepository<ExampleModel, String> {
    // Additional command-specific methods for Example can be added here
}
