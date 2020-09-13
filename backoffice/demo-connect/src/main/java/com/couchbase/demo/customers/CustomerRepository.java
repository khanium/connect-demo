package com.couchbase.demo.customers;

//import org.springframework.data.couchbase.repository.CouchbasePagingAndSortingRepository;
import org.springframework.data.couchbase.repository.CouchbaseRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends CouchbaseRepository<Customer, String> {

    List<Customer> findAllByExtentBy(String extent);
}
