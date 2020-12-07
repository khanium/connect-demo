package com.couchbase.demo.tasks;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.couchbase.core.index.CompositeQueryIndex;
import org.springframework.data.couchbase.core.index.QueryIndexed;
import org.springframework.data.couchbase.core.mapping.Document;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Document
@CompositeQueryIndex(fields = {"supervisedBy", "lastModifiedAt desc"})
public class Task {
    @Id
    String id;
    String title;
    TaskType type;
    String description;
    TaskStatus status;
    LocalDate dueDate;
    String assignTo;
    @QueryIndexed
    String supervisedBy;
    LocalDate createdAt;
    String createdBy;
    LocalDate lastModifiedAt;
    String LastModifiedBy;
    List<String> channels;

    enum TaskType {
        VISIT,
        VERIFICATION,
        ARCHITECTURE_REVIEW,
        CONSULTING,
        TAM,
        EMAIL_REPLY,
        OTHERS
    }

    public static enum TaskStatus {
        QUEUED,
        ASSIGNED,
        ACCEPTED,
        DONE
    }

}
