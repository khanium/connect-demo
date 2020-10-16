package com.couchbase.demo.load;

import com.couchbase.demo.tasks.Task;
import com.couchbase.demo.tasks.TaskService;
import com.couchbase.demo.users.UserService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class LoadService {

    private final TaskService taskService;
    private final UserService userService;
    private final ObjectMapper mapper;

    @Autowired
    public LoadService(TaskService taskService, UserService userService, ObjectMapper objectMapper) {
        this.taskService = taskService;
        this.userService = userService;
        this.mapper = objectMapper;
    }

    public void loadDemoDataSet() {
        log.info("loading Dataset...");
       // List<Task> listCar = mapper.readValue(jsonCarArray, new TypeReference<List<Task>>(){});
       // List<User> listCar = mapper.readValue(jsonCarArray, new TypeReference<List<Task>>(){});
    }



}
