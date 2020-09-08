package com.couchbase.demo.taskboard;

import com.couchbase.demo.tasks.Task;
import com.couchbase.demo.tasks.TaskService;
import com.couchbase.demo.users.User;
import com.couchbase.demo.users.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

import static com.couchbase.demo.tasks.Task.TaskStatus.DONE;
import static com.couchbase.demo.tasks.Task.TaskStatus.QUEUED;
import static java.util.Optional.ofNullable;
import static java.util.stream.Collectors.toList;

@Service
public class TaskBoardService {
    private final TaskService taskService;
    private final UserService userService;

    @Autowired
    public TaskBoardService(TaskService taskService, UserService userService) {
        this.taskService = taskService;
        this.userService = userService;
    }

    public List<TaskBoardMember> getBoardMembers(String supervisorId) {
        // TODO dynamic queued task assignment here...
        final Map<String, TaskBoardMember> mapping = new HashMap<>();
        List<User> members = userService.findAllBySupervisedBy(supervisorId, true);
        List<TaskBoardMember> boardMembers = new ArrayList<>();
        mapping.put(QUEUED.name(),TaskBoardMember.from(QUEUED));
        mapping.put(DONE.name(),TaskBoardMember.from(DONE));

        boardMembers.add(mapping.get(QUEUED.name()));
        boardMembers.addAll(members.stream().map(TaskBoardMember::of)
                .peek(m -> mapping.put(m.getUsername(),m)).collect(toList()));
        boardMembers.add(mapping.get(DONE.name()));
        List<Task> tasks = taskService.searchPendingTaskBySupervisor(supervisorId);
        TaskBoardMember m;
        for( Task t: tasks) {
            m = mapping.get(ofNullable(t.getAssignTo()).orElse(t.getStatus().name()));
            if(m!=null) {
                m.tasks.add(t);
            }
        }
        return boardMembers;
    }

}
