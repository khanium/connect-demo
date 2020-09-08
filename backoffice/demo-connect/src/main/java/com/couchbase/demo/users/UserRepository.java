package com.couchbase.demo.users;

import org.springframework.data.couchbase.repository.CouchbaseRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends CouchbaseRepository<User, String> {

    List<User> findAllBySupervisedBy(String supervisorId);
}
