package com.couchbase.demo.customers;

import org.springframework.data.annotation.Id;
import org.springframework.data.couchbase.core.mapping.Field;

import lombok.Data;

@Data
public class Customer {
	public String id;
	public String name;
	@Field("category_list")
	public String categoryList;
	public double[] geo;

	public Customer() {
	}

//	public Customer(String id, CustomerInfo nameGeo) {
//		this.id = id;
//		this.nameGeo = nameGeo;
//	}

	public static Customer of(Customer custom) {
		Customer customer = new Customer();
		customer.setId(custom.getId());
		customer.setName(custom.getName());
		customer.setCategoryList(custom.getCategoryList());
		return customer;
	}
}
