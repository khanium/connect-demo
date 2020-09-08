package com.couchbase.demo.taskboard;

import com.couchbase.demo.tasks.Task;
import com.couchbase.demo.users.User;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class TaskBoardMember extends User {
    private static final String DEFAULT_STATUS_COLOR="black";
    final List<Task> tasks = new ArrayList<>();

    public static TaskBoardMember of(User user) {
        TaskBoardMember member = new TaskBoardMember();
        member.setId(user.getId());
        member.setAvatar(user.getAvatar());
        member.setColor(user.getColor());
        member.setDisplayname(user.getDisplayname());
        member.setFirstname(user.getFirstname());
        member.setGreetings(user.getGreetings());
        member.setLastname(user.getLastname());
        member.setPassword(user.getPassword());
        member.setRole(user.getRole());
        member.setUsername(user.getUsername());
        return member;
    }

    public static TaskBoardMember from(Task.TaskStatus status) {
        TaskBoardMember member = new TaskBoardMember();
        member.setUsername(status.name());
        member.setAvatar(status.name());
        member.setColor(DEFAULT_STATUS_COLOR);
        member.setDisplayname(status.name().substring(0, 1).toUpperCase() + status.name().substring(1).toLowerCase());
        return member;
    }
}
