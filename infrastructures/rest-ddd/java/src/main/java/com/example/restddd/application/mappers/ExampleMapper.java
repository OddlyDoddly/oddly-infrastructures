/**
 * Example Mapper
 * MANDATORY for all transformations between layers.
 */

package com.example.restddd.application.mappers;

import com.example.restddd.api.dto.CreateExampleRequest;
import com.example.restddd.api.dto.ExampleResponse;
import com.example.restddd.domain.models.ExampleModel;
import com.example.restddd.infrastructure.persistence.read.ExampleReadEntity;
import com.example.restddd.infrastructure.persistence.write.ExampleWriteEntity;
import java.time.Instant;

public class ExampleMapper implements IMapper<
    CreateExampleRequest,
    ExampleModel,
    ExampleWriteEntity,
    ExampleReadEntity,
    ExampleResponse
> {
    /**
     * Mapper for Example entity.
     * 
     * Rules:
     * - Located in /application/mappers/
     * - Handles all transformations: DTO ↔ BMO ↔ Entity
     * - MANDATORY for all layer transitions
     */

    @Override
    public ExampleModel toModelFromRequest(CreateExampleRequest p_dto) {
        return new ExampleModel(
            p_dto.getName(),
            p_dto.getDescription(),
            com.example.restddd.domain.models.ExampleStatus.PENDING,
            p_dto.getOwnerId(),
            null
        );
    }

    @Override
    public ExampleWriteEntity toWriteEntity(ExampleModel p_model) {
        ExampleWriteEntity entity = new ExampleWriteEntity(
            p_model.getName(),
            p_model.getDescription(),
            p_model.getStatus().name(),
            p_model.getOwnerId()
        );
        entity.setId(p_model.getId());
        return entity;
    }

    @Override
    public ExampleModel toModelFromWriteEntity(ExampleWriteEntity p_entity) {
        return new ExampleModel(
            p_entity.getName(),
            p_entity.getDescription(),
            com.example.restddd.domain.models.ExampleStatus.valueOf(p_entity.getStatus()),
            p_entity.getOwnerId(),
            p_entity.getId()
        );
    }

    @Override
    public ExampleResponse toResponseFromReadEntity(ExampleReadEntity p_entity) {
        return new ExampleResponse(
            p_entity.getId(),
            p_entity.getName(),
            p_entity.getDescription(),
            p_entity.getStatus(),
            p_entity.getOwnerId(),
            p_entity.getOwnerName(),
            p_entity.getCreatedAt(),
            p_entity.getUpdatedAt()
        );
    }

    @Override
    public ExampleResponse toResponseFromModel(ExampleModel p_model) {
        return new ExampleResponse(
            p_model.getId(),
            p_model.getName(),
            p_model.getDescription(),
            p_model.getStatus().name(),
            p_model.getOwnerId(),
            "",  // Not available in model
            Instant.now().toString(),
            Instant.now().toString()
        );
    }
}
