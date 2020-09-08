package com.couchbase.demo.taskboard;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/board")
public class TaskBoardController {
    private final TaskBoardService service;

    @Autowired
    public TaskBoardController(TaskBoardService service) {
        this.service = service;
    }

    @GetMapping(path = "/{userId}")
    public ResponseEntity<List<TaskBoardMember>> getTasksBoard(@PathVariable String userId) {
        log.info("loading {} board", userId);
        return ResponseEntity.ok(service.getBoardMembers(userId));
    }


}
