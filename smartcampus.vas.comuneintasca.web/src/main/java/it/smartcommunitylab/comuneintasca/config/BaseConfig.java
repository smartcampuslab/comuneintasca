package it.smartcommunitylab.comuneintasca.config;

import java.net.UnknownHostException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import com.mongodb.MongoClient;
import com.mongodb.MongoException;

@Configuration
@ComponentScan("it.smartcommunitylab.comuneintasca")
public class BaseConfig extends WebMvcConfigurerAdapter{

	@Autowired
	private Environment env;
	
	@Bean(name="mongoTemplate")
	public MongoTemplate getMongoTemplate() throws UnknownHostException, MongoException {
		return new MongoTemplate(
				new MongoClient(
						env.getProperty("smartcampus.vas.web.mongo.host"), 
						Integer.parseInt(env.getProperty("smartcampus.vas.web.mongo.port"))), 
				"comuneintasca-multi");
	}

}
