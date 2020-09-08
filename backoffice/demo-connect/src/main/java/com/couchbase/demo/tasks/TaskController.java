package com.couchbase.demo.tasks;

import com.couchbase.demo.taskboard.TaskBoardMember;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.function.EntityResponse;

import java.util.List;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@Slf4j
@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService service;

    @Autowired
    public TaskController(TaskService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public EntityResponse<Task> getById(@PathVariable String id) {
        return EntityResponse.fromObject(service.findById(id)).build();
    }

    @PostMapping(path = "/", consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Task> save(@RequestBody Task task) {
        log.info("saving {}", task.getId());
        return ResponseEntity.ok(service.save(task));
    }

    @GetMapping
    public ResponseEntity<Page<Task>> getAll(@RequestParam Pageable pageable){
        log.info("get all");
        return ResponseEntity.ok(service.findAll(pageable));
    }


    @PutMapping(path = "/{taskId}/move/{toDst}")
    public void moveTask(@PathVariable String taskId,@PathVariable String toDst){
        log.debug("move {} task to {} user", taskId, toDst);
        service.move(taskId,toDst);
    }


    @PutMapping(path = "/{taskId}/alter/{newStatus}")
    public void alterTask(@PathVariable String taskId,@PathVariable Task.TaskStatus newStatus){
        log.debug("alter {} task to {} status", taskId, newStatus);
        service.updateStatus(taskId, newStatus);
    }

/*
    @GetMapping(path = "/{userId}/all")
    public ResponseEntity<List<Task>> getTasksBySupervisor(@PathVariable String supervisorId,
                                                       @RequestParam(defaultValue = "QUEUED") Task.TaskStatus status) {
        return ResponseEntity.ok(service.searchBySupervisorAndStatus(supervisorId, status));
    }

    @GetMapping(path = "/{userId}/all")
    public ResponseEntity<List<Task>> getPendingTasksBy(@PathVariable String supervisorId) {
        return ResponseEntity.ok(service.searchPendingTaskBySupervisor(supervisorId));
    }
*/
}
