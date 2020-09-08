package com.couchbase.demo.users;

import lombok.Data;
import org.springframework.data.annotation.Id;

import java.time.LocalDate;


@Data
public class User {

    @Id
    String id;
    String greetings;
    String firstname;
    String lastname;
    String displayname;
    String color;
    String avatar;
    String username;
    String password;
    String supervisedBy;
    UserRole role;
    LocalDate createdAt;
    String createdBy;
    LocalDate lastModifiedAt;
    String LastModifiedBy;

    enum UserRole {
        FIELD_TECHNICIAN,
        BACKOFFICE_USER,
        FIELD_MANAGER
    }
}
