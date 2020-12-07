package com.couchbase.demo.load;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("load")
public class LoadController {

    private final LoadService service;

    @Autowired
    public LoadController(LoadService service) {
        this.service = service;
    }

    @PostMapping("dataset")
    public void load() {
        service.loadDemoDataSet();
    }

}
