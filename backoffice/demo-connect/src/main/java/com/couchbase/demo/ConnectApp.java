package com.couchbase.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ConnectApp {

    public static void main(String[] args) {
        SpringApplication.run(ConnectApp.class, args);
        System.out.println("Open your browser at http://localhost:8080/connect ");
    }


}
