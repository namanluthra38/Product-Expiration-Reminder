package com.verfalarm.entity;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

@Document(collection = "messages")
@Data
@Builder
@AllArgsConstructor
public class Message {

    @Id
    private String id;
    private String name;
    private String email;
    private String message;

    public Message() {
    }

    public Message(String name, String email, String message) {
        this.name = name;
        this.email = email;
        this.message = message;
    }


    
}

