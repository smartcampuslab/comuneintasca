package it.smartcommunitylab.comuneintasca.config;

import java.net.UnknownHostException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

import com.mongodb.MongoClient;
import com.mongodb.MongoException;

@Configuration
@EnableWebMvc
@ComponentScan("it.smartcommunitylab.comuneintasca")
public class BaseConfig extends WebMvcConfigurerAdapter {

	@Autowired
	private Environment env;

	@Bean(name = "mongoTemplate")
	public MongoTemplate getMongoTemplate() throws UnknownHostException,
			MongoException {
		return new MongoTemplate(new MongoClient(
				env.getProperty("smartcampus.vas.web.mongo.host"),
				Integer.parseInt(env
						.getProperty("smartcampus.vas.web.mongo.port"))),
				"comuneintasca-multi");
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
