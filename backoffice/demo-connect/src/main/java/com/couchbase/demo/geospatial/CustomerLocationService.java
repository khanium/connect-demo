package com.couchbase.demo.geospatial;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.couchbase.client.java.Cluster;
import com.couchbase.client.java.manager.bucket.BucketSettings;
import com.couchbase.client.java.search.SearchOptions;
import com.couchbase.client.java.search.SearchQuery;
import com.couchbase.client.java.search.queries.GeoBoundingBoxQuery;
import com.couchbase.client.java.search.result.SearchResult;
import com.couchbase.client.java.search.result.SearchRow;
import com.couchbase.demo.customers.Customer;
import com.couchbase.demo.customers.CustomerRepository;

@Service
public class CustomerLocationService {
	private final CustomerRepository customerRepository;

	@Autowired
	private Cluster cluster;

	@Autowired
	public CustomerLocationService(CustomerRepository customerRepository) {
		this.customerRepository = customerRepository;
	}

	public List<Customer> getCustomerInExtent(double topLeftLon, double topLeftLat, double bottomRightLon,
			double bottomRightLat) {
		// TODO dynamic queued task assignment here...
		final List<Customer> customers = new ArrayList<Customer>();

		// customerRepository.
		GeoBoundingBoxQuery geoBoundingBox = SearchQuery.geoBoundingBox(
				topLeftLon, 
				topLeftLat, 
				bottomRightLon,
				bottomRightLat);
		geoBoundingBox.field("geo");
		
//		SearchResult searchResult = cluster.searchQuery("geoIndex", 
//				SearchQuery.geoDistance(topLeftLon, topLeftLat, "100"));
		SearchOptions so = SearchOptions.searchOptions();

		so.fields(new String[]{"name","geo"});
		so.limit(10000);
		SearchResult searchResult = cluster.searchQuery("geoIndex", 
				SearchQuery.geoBoundingBox(topLeftLon, topLeftLat, bottomRightLon, bottomRightLat), so);
		
		long totalRows = searchResult.metaData().metrics().totalRows();
		System.out.println("Found # rows: " + totalRows);
		
		for (SearchRow row : searchResult.rows()) {
			Customer customer = row.fieldsAs(Customer.class);
			customer.id = row.id();
			customers.add(customer);
		}

		return customers;
	}
}
