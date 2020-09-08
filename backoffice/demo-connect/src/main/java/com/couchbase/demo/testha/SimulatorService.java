package com.couchbase.demo.testha;

import com.couchbase.client.java.Cluster;
import org.springframework.data.couchbase.repository.CouchbaseRepository;

import java.time.LocalDateTime;

public class SimulatorService<T> {
    private final CouchbaseRepository<T,String> repository;


    public SimulatorService(CouchbaseRepository<T, String> repository) {
        this.repository = repository;
    }

    public SimulatorResponse<T> get(String id) {
        SimulatorResponse<T> response;
        long init = System.nanoTime();
        try {
            T value = repository.findById(id).orElse(null);
            float latency = (System.nanoTime() - init)/1000000.0f;
            response = SimulatorResponse.<T>builder().value(value).latency(latency).type(SimulatorResponse.Operation.READ).timestamp(LocalDateTime.now()).build();
        } catch (RuntimeException ex) {
            float latency = (System.nanoTime() - init)/1000000.0f;
            response = SimulatorResponse.<T>builder().latency(latency).type(SimulatorResponse.Operation.READ).status(SimulatorResponse.Status.ERROR).message(ex.toString()).timestamp(LocalDateTime.now()).build();
        }
        return response;
    }

    public SimulatorResponse<T> save(T value) {
        SimulatorResponse<T> response;
        long init = System.nanoTime();
        try {
            T val = repository.save(value);
            float latency = (float)(System.nanoTime() - init)/(1000000.0f);
            response = SimulatorResponse.<T>builder().value(val).latency(latency).type(SimulatorResponse.Operation.WRITE).timestamp(LocalDateTime.now()).build();
        } catch (RuntimeException ex) {
            float latency = (float)(System.nanoTime() - init)/(1000000.0f);
            response = SimulatorResponse.<T>builder().latency(latency).type(SimulatorResponse.Operation.WRITE).status(SimulatorResponse.Status.ERROR).message(ex.toString()).timestamp(LocalDateTime.now()).build();
        }
        return response;
    }

    public SimulatorResponse<Iterable<T>> getAll() {
        SimulatorResponse<Iterable<T>> response;
        long init = System.nanoTime();
        try {
            Iterable<T> content = repository.findAll();
            float latency = (float)(System.nanoTime() - init)/(1000000.0f);
            response = SimulatorResponse.<Iterable<T>>builder().value(content).latency(latency).type(SimulatorResponse.Operation.QUERY).timestamp(LocalDateTime.now()).build();
        } catch (RuntimeException ex) {
            float latency = (float)(System.nanoTime() - init)/(1000000.0f);
            response = SimulatorResponse.<Iterable<T>>builder().latency(latency).type(SimulatorResponse.Operation.QUERY).status(SimulatorResponse.Status.ERROR).message(ex.toString()).timestamp(LocalDateTime.now()).build();
        }
        return response;
    }


}
