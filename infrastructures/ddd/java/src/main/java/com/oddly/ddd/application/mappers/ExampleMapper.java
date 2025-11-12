package com.oddly.ddd.application.mappers;

import com.oddly.ddd.api.dto.v1.requests.CreateExampleRequest;
import com.oddly.ddd.api.dto.v1.responses.ExampleResponse;
import com.oddly.ddd.application.mappers.infra.IMapper;
import com.oddly.ddd.domain.models.ExampleModel;
import com.oddly.ddd.infrastructure.persistence.read.ExampleReadEntity;
import com.oddly.ddd.infrastructure.persistence.write.ExampleWriteEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper for Example domain transformations.
 * Mappers:
 * - Live in /application/mappers/
 * - Have Mapper suffix
 * - Implementations in root (NO /impl/ - no autowiring contracts)
 * - Handle all transformations between DTOs, BMOs, and Entities
 */
@Component
public class ExampleMapper implements IMapper<CreateExampleRequest, ExampleResponse, ExampleModel, ExampleWriteEntity, ExampleReadEntity> {

    @Override
    public ExampleModel toModelFromRequest(CreateExampleRequest p_request) {
        return new ExampleModel(
            p_request.getName(),
            p_request.getDescription(),
            p_request.getCategory(),
            "" // Owner ID will be set by service
        );
    }

    @Override
    public ExampleWriteEntity toWriteEntity(ExampleModel p_model) {
        ExampleWriteEntity entity = new ExampleWriteEntity();
        entity.setId(p_model.getId());
        entity.setName(p_model.getName());
        entity.setDescription(p_model.getDescription());
        entity.setCategory(p_model.getCategory());
        entity.setActive(p_model.isActive());
        entity.setOwnerId(p_model.getOwnerId());
        entity.setCreatedAt(p_model.getCreatedAt());
        entity.setUpdatedAt(p_model.getUpdatedAt());
        return entity;
    }

    @Override
    public ExampleModel toModelFromWriteEntity(ExampleWriteEntity p_entity) {
        ExampleModel model = new ExampleModel(
            p_entity.getId(),
            p_entity.getName(),
            p_entity.getDescription(),
            p_entity.getCategory(),
            p_entity.isActive(),
            p_entity.getOwnerId()
        );
        return model;
    }

    @Override
    public ExampleResponse toResponseFromReadEntity(ExampleReadEntity p_entity) {
        ExampleResponse response = new ExampleResponse();
        response.setId(p_entity.getId());
        response.setName(p_entity.getName());
        response.setDescription(p_entity.getDescription());
        response.setCategory(p_entity.getCategory());
        response.setActive(p_entity.isActive());
        response.setOwnerId(p_entity.getOwnerId());
        response.setTimestamp(p_entity.getUpdatedAt());
        return response;
    }

    @Override
    public ExampleResponse toResponseFromModel(ExampleModel p_model) {
        ExampleResponse response = new ExampleResponse();
        response.setId(p_model.getId());
        response.setName(p_model.getName());
        response.setDescription(p_model.getDescription());
        response.setCategory(p_model.getCategory());
        response.setActive(p_model.isActive());
        response.setOwnerId(p_model.getOwnerId());
        response.setTimestamp(p_model.getUpdatedAt());
        return response;
    }
}
