package eu.trentorise.smartcampus.comuneintasca.test.config;

import java.net.UnknownHostException;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.mongodb.MongoClient;
import com.mongodb.MongoException;

@Configuration
@ComponentScan(basePackages = "eu.trentorise.smartcampus.comuneintasca")
@EnableMongoRepositories(basePackages = "eu.trentorise.smartcampus.comuneintasca.connector")
public class TestConfig {

	@Bean(name="mongoTemplate")
	public MongoTemplate getMongoTemplate() throws UnknownHostException, MongoException {
		return new MongoTemplate(new MongoClient(), "comuneintasca-multi-test");
	}

	@Bean
	public TestServiceBusClient getServiceBusClient() {
		return new TestServiceBusClient();
	}
}
