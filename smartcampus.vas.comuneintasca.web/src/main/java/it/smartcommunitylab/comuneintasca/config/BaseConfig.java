package it.smartcommunitylab.comuneintasca.config;

import java.io.IOException;
import java.net.UnknownHostException;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

import com.mongodb.MongoClient;
import com.mongodb.MongoException;

import it.smartcommunitylab.comuneintasca.connector.AppManager;

@Configuration
@EnableWebMvc
@ComponentScan("it.smartcommunitylab.comuneintasca")
public class BaseConfig extends WebMvcConfigurerAdapter {

	@Autowired
	private Environment env;
	@Autowired
	private AppManager appManager;
	@Value("classpath:/connectors.yml")
	private Resource resource;

	@Bean(name = "mongoTemplate")
	public MongoTemplate getMongoTemplate() throws UnknownHostException,
			MongoException {
		return new MongoTemplate(new MongoClient(
				env.getProperty("smartcampus.vas.web.mongo.host"),
				Integer.parseInt(env
						.getProperty("smartcampus.vas.web.mongo.port"))),
				"comuneintasca-multi");
	}
	
	@PostConstruct
	public void initialize() throws IOException {
		appManager.initialize(resource.getInputStream());
	}


	@Bean
	public ViewResolver getViewResolver() {
		InternalResourceViewResolver resolver = new InternalResourceViewResolver();
		resolver.setPrefix("/resources/");
		resolver.setSuffix(".html");
		return resolver;
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/resources/*").addResourceLocations(
				"/resources/");
		registry.addResourceHandler("/css/**").addResourceLocations(
				"/resources/css/");
		registry.addResourceHandler("/fonts/**").addResourceLocations(
				"/resources/fonts/");
		registry.addResourceHandler("/js/**").addResourceLocations(
				"/resources/js/");
		registry.addResourceHandler("/lib/**").addResourceLocations(
				"/resources/lib/");
		registry.addResourceHandler("/templates/**").addResourceLocations(
				"/resources/templates/");
	}

}
