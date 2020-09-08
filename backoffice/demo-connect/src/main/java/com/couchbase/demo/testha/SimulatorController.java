package com.couchbase.demo.testha;

import com.couchbase.demo.tasks.Task;
import com.couchbase.demo.testha.TopologyInfo.ClusterNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.couchbase.demo.testha.TopologyInfo.CBService.*;
import static com.couchbase.demo.testha.TopologyInfo.Status.HEALTHY;

@Slf4j
@RestController
@RequestMapping("simulator")
public class SimulatorController {
    private final SimulatorService<Task> service;

    @Autowired
    public SimulatorController(SimulatorService service) {
        this.service = service;
    }

    @GetMapping("/info")
    public TopologyInfo get() {
        TopologyInfo.ClusterTopology clusterA = TopologyInfo.ClusterTopology.builder().name("cb-demo").active(true).status(HEALTHY)
                .nodes(List.of(ClusterNode.builder().name("cb-demo0001").services(List.of(Data, Query, Index, Analytics)).status(HEALTHY).build(),
                        ClusterNode.builder().name("cb-demo0002").services(List.of(Data, Query, Index, Analytics)).status(HEALTHY).build(),
                        ClusterNode.builder().name("cb-demo0003").services(List.of(Data, Query, Index, Analytics)).status(HEALTHY).build())).build();

        return TopologyInfo.builder().appName("App").cluster(clusterA).build();
    }

    @GetMapping("tasks/{id}")
    public ResponseEntity<SimulatorResponse<Task>> get(@PathVariable String id) {
        log.info("reading {}...",id);
        return ResponseEntity.ok(service.get(id));
    }

    @PostMapping("tasks")
    public ResponseEntity<SimulatorResponse<Task>> save(@RequestBody Task airport) {
       log.info("Saving...");
        return ResponseEntity.ok(service.save(airport));
    }

    @GetMapping("tasks")
    public ResponseEntity<SimulatorResponse<Iterable<Task>>> getAll() {
        log.info("Querying...");
        return ResponseEntity.ok(service.getAll());
    }

}
