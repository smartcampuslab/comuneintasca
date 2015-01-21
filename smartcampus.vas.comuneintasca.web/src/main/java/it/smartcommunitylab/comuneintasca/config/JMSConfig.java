package it.smartcommunitylab.comuneintasca.config;

import javax.jms.ConnectionFactory;

import org.apache.activemq.ActiveMQConnectionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
public class JMSConfig {

	@Autowired
	private Environment env;

	@Bean(name="connectionFactory")
	public ConnectionFactory getActiveMQFactory() {
		return new ActiveMQConnectionFactory(env.getProperty("smartcampus.vas.web.activeMQ.brokerURL"));
	}

}
