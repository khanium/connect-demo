package com.couchbase.demo.geospatial;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.couchbase.demo.customers.Customer;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class CustomerLocationController {
	private final CustomerLocationService service;

	@Autowired
	public CustomerLocationController(CustomerLocationService service) {
		this.service = service;
	}

	@RequestMapping("/geospatial/searchextent")
	public ResponseEntity<List<Customer>> getCustomer(@RequestParam("minLon") double minLon,
			@RequestParam("minLat") double minLat, @RequestParam("maxLon") double maxLon,
			@RequestParam("maxLat") double maxLat) {
//        log.info("loading {} extent", extent);
		return ResponseEntity.ok(service.getCustomerInExtent(minLon, maxLat, maxLon, minLat));
	}

}
