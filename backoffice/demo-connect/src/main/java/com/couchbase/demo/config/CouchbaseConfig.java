package com.couchbase.demo.config;

import com.couchbase.client.core.env.ThresholdRequestTracerConfig;
import com.couchbase.client.java.Cluster;
import com.couchbase.client.java.env.ClusterEnvironment;
import com.couchbase.transactions.Transactions;
import com.couchbase.transactions.config.TransactionConfigBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.couchbase.config.AbstractCouchbaseConfiguration;
import org.springframework.data.couchbase.core.convert.MappingCouchbaseConverter;

import java.time.Duration;

@Configuration
public class CouchbaseConfig extends AbstractCouchbaseConfiguration {

    @Value("${couchbase.bootstrap-hosts:localhost}")
    private String bootstrapHosts;
    @Value("${couchbase.bucket.name:travel-sample}")
    private String bucketName;
    @Value("${couchbase.user.name:Administrator}")
    private String username;
    @Value("${couchbase.user.password:password}")
    private String userPassword;

    @Override
    public String getConnectionString() {
        return bootstrapHosts;
    }

    @Override
    public String getUserName() {
        return username;
    }

    @Override
    public String getPassword() {
        return userPassword;
    }

    @Override
    public String getBucketName() {
        return bucketName;
    }

    @Override
    protected void configureEnvironment(ClusterEnvironment.Builder builder) {
        builder.thresholdRequestTracerConfig(new ThresholdRequestTracerConfig.Builder().kvThreshold(Duration.ofSeconds(1)))
                .timeoutConfig().kvTimeout(Duration.ofSeconds(1));
        //TODO setup all your environment variables here
    }

    @Bean
    public Transactions transactions(final Cluster couchbaseCluster) {
        return Transactions.create(couchbaseCluster, TransactionConfigBuilder.create()
                // The configuration can be altered here, but in most cases the defaults are fine.
                .build());
    }

    @Override
    public String typeKey(){
        return MappingCouchbaseConverter.TYPEKEY_SYNCGATEWAY_COMPATIBLE;
    }

}
