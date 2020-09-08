package com.couchbase.demo.users;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    private final String USER_ID_PREFIX="user:app:";
    private final UserRepository repository;

    @Autowired
    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public List<User> findAllBySupervisedBy(String supervisorId, boolean includeSelf) {
        List<User> supervisedBy= new ArrayList<>();
        if(includeSelf) {
            supervisedBy.add(repository.findById(USER_ID_PREFIX.concat(supervisorId)).orElseThrow());
        }
        supervisedBy.addAll(repository.findAllBySupervisedBy(supervisorId));
        return supervisedBy;
    }
}
