package com.verfalarm.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.verfalarm.entity.User;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, ObjectId> {

    User findByUserName(String userName);
    void deleteByUserName(String userName);

    boolean existsByEmail(String email);

    boolean existsByUserName(String userName);

    Optional<User> findById(ObjectId userId);

    Optional<User> findByEmail(String email);
}


