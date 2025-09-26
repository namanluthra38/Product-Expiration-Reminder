package com.verfalarm.repository;

import com.verfalarm.entity.Product;
import com.verfalarm.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public class UserRepositoryImpl {
    @Autowired
    MongoTemplate mongoTemplate;

    public List<User> getUsersForAlert(){
        Query query = new Query();
        query.addCriteria(Criteria.where("wantsAlert").is(true));
        List<User> ls = mongoTemplate.find(query, User.class);
        return ls;
    }
}
