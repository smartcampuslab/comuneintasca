package eu.trentorise.smartcampus.comuneintasca.connector.processor;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import eu.trentorise.smartcampus.comuneintasca.model.EventObject;

public class EventMappingDescriptor extends MappingDescriptor {

	public EventMappingDescriptor() {
		super("event", "event", EventObject.class, "tipo_evento", "tipo_eventi_manifestazioni");
	}

	@Override
	public String extractClassification(List<Map<String, String>> classifications) throws BadDataException {
		List<String> list = new ArrayList<String>();
		for (Map<String, String> classifics : classifications) {
			for (String key : classifics.keySet()) {
				if (!getQueryKeys().contains(key)) {
					throw new BadDataException("Unknown query key: "+key +" for type "+getRemoteType());
				}
				String val = classifics.get(key);
				// HARD-CODED HANDLING OF MANIFESTAZIONI
				if ("tipo_eventi_manifestazioni".equals(key)) {
					if (val.equalsIgnoreCase("Manifestazione")) return "_complex";
					else continue;
				}
				if (val != null) {
					list.add(val);
				}
			}
		}
		if (list.isEmpty()) return "";
		return StringUtils.join(list, ';');
	}

	
	
}
