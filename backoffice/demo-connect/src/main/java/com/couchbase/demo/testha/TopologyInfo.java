package com.couchbase.demo.testha;

import lombok.Builder;
import lombok.Value;

import java.util.List;

@Builder
@Value
public class TopologyInfo {
    ClusterTopology cluster;
    String appName;

    @Builder
    @Value
    static class ClusterTopology {
        String name;
        List<ClusterNode> nodes;
        Status status;
        boolean active;
    }

    @Value
    @Builder
    static class ClusterNode {
        String name;
        List<CBService> services;
        Status status;
    }

    enum Status {
        HEALTHY,
        UNHEALTHY,
        UNKNOWN
    }

    enum CBService {
        Data,
        Query,
        Index,
        Fts,
        Eventing,
        Analytics
    }

}
