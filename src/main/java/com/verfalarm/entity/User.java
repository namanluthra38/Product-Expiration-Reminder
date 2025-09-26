package com.verfalarm.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private ObjectId id;
    String strid;
    
    @Indexed(unique = true)
    @NonNull
    private String userName;

    @Indexed(unique = true)
    @NonNull
    private String email;

    private boolean wantsAlert;
    
    @NonNull
    private String password;
    
    private List<String> roles;
    
    @DBRef
    private List<Product> productList = new ArrayList<>();
    @JsonProperty("id")
    public String getIdstr() {
        this.strid = id != null ? id.toHexString() : null;
        return this.strid;
    }
}
