package eu.trentorise.smartcampus.comuneintasca.connector;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class App {

	private String id;
	private List<SourceEntry> sources;

	private Map<TypeClassifier, SourceEntry> entryMap = new HashMap<TypeClassifier, SourceEntry>();
	
	public App(String id, List<SourceEntry> sources) {
		super();
		this.id = id;
		this.sources = sources;
		for (SourceEntry s : sources) {
			entryMap.put(new TypeClassifier(s.getType(), s.getClassifier()), s);
		}
	}
	
	public App() {
		super();
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public SourceEntry findEntry(String serviceId, String methodName, String subscriptionId) {
		for (SourceEntry entry : sources) {
			if (entry.getSubscriptionId().equals(subscriptionId) &&
				entry.getServiceId().equals(serviceId)			 &&
				entry.getMethodName().equals(methodName)) return entry;
		}
		return null;
	}

	public SourceEntry findEntry(String type, String classifier) {
		return entryMap.get(new TypeClassifier(type, classifier));
	}
	
	public List<SourceEntry> getSources() {
		return sources;
	}

	public void setSources(List<SourceEntry> sources) {
		this.sources = sources;
	}
}
