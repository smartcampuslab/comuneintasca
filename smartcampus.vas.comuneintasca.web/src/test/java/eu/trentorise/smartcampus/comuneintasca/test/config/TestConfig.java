package eu.trentorise.smartcampus.comuneintasca.test.config;

import java.net.UnknownHostException;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.mongodb.Mongo;
import com.mongodb.MongoException;

import eu.trentorise.smartcampus.comuneintasca.connector.processor.DataProcessor;

@Configuration
@ComponentScan(basePackages = "eu.trentorise.smartcampus.comuneintasca")
public class TestConfig {

	@Bean
	public MongoTemplate getMongoTemplate() throws UnknownHostException, MongoException {
		return new MongoTemplate(new Mongo(), "comuneintasca-multi-test");
	}

	@Bean
	public TestServiceBusClient getServiceBusClient() {
		return new TestServiceBusClient(new DataProcessor());
	}
}
