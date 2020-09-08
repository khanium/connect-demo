package com.couchbase.demo.tasks;

import org.springframework.data.couchbase.repository.CouchbaseRepository;
import org.springframework.data.couchbase.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends CouchbaseRepository<Task, String> {

    List<Task> findBySupervisedByAndStatus(String supervisedBy, Task.TaskStatus status);

    @Query("#{#n1ql.selectEntity} WHERE #{#n1ql.filter} " +
            "  AND supervisedBy = $1 " +
            "  AND status!=\"DONE\" " +
            "ORDER BY status, lastModifiedAt desc")
    List<Task> findBySupervisedByAndNotDone(String userId);


    @Query("#{#n1ql.selectEntity} WHERE #{#n1ql.filter} " +
            "  AND supervisedBy = $1 " +
            "ORDER BY lastModifiedAt desc " +
            "LIMIT 100")
    List<Task> findBySupervisedBy(String userId);


}
