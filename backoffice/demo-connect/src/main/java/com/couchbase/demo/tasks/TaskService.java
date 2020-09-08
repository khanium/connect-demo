package com.couchbase.demo.tasks;

import com.couchbase.client.java.Bucket;
import com.couchbase.client.java.Collection;
import com.couchbase.client.java.kv.MutateInSpec;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.couchbase.core.CouchbaseTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static com.couchbase.client.java.kv.MutateInSpec.remove;
import static com.couchbase.client.java.kv.MutateInSpec.upsert;
import static com.couchbase.demo.tasks.Task.TaskStatus.QUEUED;

@Slf4j
@Service
public class TaskService {

    private final TaskRepository repository;
    private final Collection collection;

    @Autowired
    public TaskService(TaskRepository repository, CouchbaseTemplate couchbaseTemplate) {
        this.repository = repository;
        collection = couchbaseTemplate.getCouchbaseClientFactory().getBucket().defaultCollection();
    }

    public Task findById(String id) {
        return this.repository.findById(id).orElse(null);
    }

    public Task save(Task task) {
       return repository.save(task);
    }

    public Page<Task> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public List<Task> searchBySupervisorAndStatus(String supervisorId, Task.TaskStatus status) {
        return repository.findBySupervisedByAndStatus(supervisorId, status);
    }

    public List<Task> searchPendingTaskBySupervisor(String supervisorId) {
        return repository.findBySupervisedBy(supervisorId);
    }

    public void move(String taskId, String toDst) {
        log.info("moving {} task assignment to {}",taskId, toDst);
        collection.mutateIn(taskId, Arrays.asList(
                upsert("assignTo", toDst),
                upsert("channels", Collections.singletonList(toDst))
        ));
    }

    public void updateStatus(String taskId, Task.TaskStatus newStatus) {
        log.info("updating {} task status to {}",taskId, newStatus);
        List<MutateInSpec> mutations = Arrays.asList( upsert("status", newStatus) );
        if(QUEUED.equals(newStatus)) {
                mutations.add(remove("assignTo"));
        }
        collection.mutateIn(taskId,mutations);
    }

}
