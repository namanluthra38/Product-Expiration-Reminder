package com.verfalarm.repository;

import com.verfalarm.entity.Product;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ProductRepository extends MongoRepository<Product, ObjectId> {
    @Override
    void deleteById(ObjectId objectId);
}
