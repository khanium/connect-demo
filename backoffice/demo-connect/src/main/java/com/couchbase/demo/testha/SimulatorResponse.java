package com.couchbase.demo.testha;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;
import java.util.Set;

@Value
@Builder
public class SimulatorResponse<T> {
    Operation type;
    LocalDateTime timestamp;
    T value;
    Float latency;
    @Builder.Default
    Status status = Status.SUCCESS;
    String message;

    enum Operation {
        WRITE,
        READ,
        QUERY
    }

    enum Status {
        SUCCESS,
        ERROR
    }


}
