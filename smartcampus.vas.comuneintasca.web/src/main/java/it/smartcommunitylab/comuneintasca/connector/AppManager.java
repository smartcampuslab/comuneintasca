package it.smartcommunitylab.comuneintasca.connector;

import it.sayservice.platform.client.ServiceBusClient;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.yaml.snakeyaml.Yaml;
import org.yaml.snakeyaml.constructor.Constructor;

@Component
public class AppManager {

	@Autowired
	private AppRepository appRepository; 
	
	private Map<String, App> appMap = new HashMap<String, App>();
	
	public void initialize(InputStream appSource, ServiceBusClient serviceBusClient) throws IOException {
		Yaml yaml = new Yaml(new Constructor(AppSetup.class));
		AppSetup appSetup = (AppSetup) yaml.load(appSource);
		
		Subscriber subscriber = new Subscriber(serviceBusClient);
		for (App app : appSetup.getApps()) {
			App old = appRepository.findOne(app.getId());
			merge(app, old);
			subscriber.subscribe(app);
			appRepository.save(app);
			appMap.put(app.getId(), app);
		}
		List<App> old = appRepository.findAll();
		for (App a : old) {
			if (!appMap.containsKey(a.getId())) {
				subscriber.unsubscribe(a);
				appRepository.delete(a);
			}
		}
	}

	private void merge(App app, App old) {
		Map<TypeClassifier,SourceEntry> entryMap = new HashMap<TypeClassifier, SourceEntry>();
		for (SourceEntry e : app.getSources()) {
			entryMap.put(new TypeClassifier(e.getType(), e.getClassifier()), e);
		}
		if (old != null) {
			for (SourceEntry e : old.getSources()) {
				TypeClassifier key = new TypeClassifier(e.getType(), e.getClassifier());
				if (entryMap.containsKey(key)) {
					entryMap.get(key).setSubscriptionId(e.getSubscriptionId());
				}
			}
		}
	}

	public App getApp(String serviceId, String methodName, String subscriptionId) {
		App app = appRepository.findBySubscriptionId(subscriptionId);
		if (app != null) {
			SourceEntry entry = app.findEntry(serviceId, methodName, subscriptionId);
			if (entry != null) {
				return app;
			}
		}
		return null;
	}
}
