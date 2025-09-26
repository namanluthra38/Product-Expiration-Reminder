package com.verfalarm.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.verfalarm.entity.Message;
public interface MessageRepository extends MongoRepository<Message, String> {
}
