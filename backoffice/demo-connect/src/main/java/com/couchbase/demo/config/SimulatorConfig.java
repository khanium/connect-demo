package com.couchbase.demo.config;

import com.couchbase.client.java.Cluster;
import com.couchbase.demo.tasks.Task;
import com.couchbase.demo.tasks.TaskRepository;
import com.couchbase.demo.testha.SimulatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SimulatorConfig {
    @Bean
    @Autowired
    public SimulatorService<Task> simulatorService(TaskRepository repository) {
        return new SimulatorService<Task>(repository);
    }
}
