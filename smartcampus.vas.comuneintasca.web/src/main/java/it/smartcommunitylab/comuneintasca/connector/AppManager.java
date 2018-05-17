package it.smartcommunitylab.comuneintasca.connector;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.yaml.snakeyaml.Yaml;
import org.yaml.snakeyaml.constructor.Constructor;

import it.smartcommunitylab.comuneintasca.connector.processor.DataProcessor;

@Component
public class AppManager {

	@Autowired
	private AppRepository appRepository; 
	@Autowired
	private DataProcessor processor;
	
	private Map<String, App> appMap = new HashMap<String, App>();
	
	public void initialize(InputStream appSource) throws IOException {
		Yaml yaml = new Yaml(new Constructor(AppSetup.class));
		AppSetup appSetup = (AppSetup) yaml.load(appSource);
		
		for (App app : appSetup.getApps()) {
			App old = appRepository.findOne(app.getId());
			merge(app, old);
			Subscriber subscriber = new Subscriber();
			subscriber.subscribe(app, processor);
			appRepository.save(app);
			appMap.put(app.getId(), app);
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

	public App getApp(String appId, String serviceId, String methodName) {
		App app = appRepository.findByApp(appId);
		if (app != null) {
			SourceEntry entry = app.findEntry(serviceId, methodName);
			if (entry != null) {
				return app;
			}
		}
		return null;
	}
}
