package it.smartcommunitylab.comuneintasca.config;

import java.io.IOException;

import javax.annotation.PostConstruct;
import javax.jms.ConnectionFactory;

import it.sayservice.platform.client.InvocationException;
import it.sayservice.platform.client.ServiceBusListener;
import it.sayservice.platform.client.jms.JMSServiceBusClient;
import it.smartcommunitylab.comuneintasca.connector.AppManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

//@Component
public class WiredServiceBusClient extends JMSServiceBusClient {

	@Autowired
	private ServiceBusListener listener;

	@Autowired
	private AppManager appManager;
	
	@Autowired
	public WiredServiceBusClient(ConnectionFactory factory) throws InvocationException {
		super(factory);
	}

	@Value("classpath:/connectors.yml")
	private Resource resource;

	@PostConstruct
	public void initialize() throws InvocationException, IOException {
		setClientId("vas_comuneintasca_multi_subscriber");
		setListener(listener);
		appManager.initialize(resource.getInputStream(), this);
	}
}
