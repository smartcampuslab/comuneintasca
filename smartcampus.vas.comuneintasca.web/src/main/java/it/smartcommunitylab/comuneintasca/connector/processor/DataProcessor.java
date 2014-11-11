package it.smartcommunitylab.comuneintasca.connector.processor;

import it.sayservice.platform.client.ServiceBusListener;
import it.smartcommunitylab.comuneintasca.connector.App;
import it.smartcommunitylab.comuneintasca.connector.AppManager;
import it.smartcommunitylab.comuneintasca.connector.ConnectorStorage;
import it.smartcommunitylab.comuneintasca.connector.SourceEntry;
import it.smartcommunitylab.comuneintasca.connector.Subscriber;
import it.smartcommunitylab.comuneintasca.connector.processor.ConfigProcessor.ObjectFilters;
import it.smartcommunitylab.comuneintasca.connector.processor.DataExtractor.Extractor;
import it.smartcommunitylab.comuneintasca.core.model.AppObject;
import it.smartcommunitylab.comuneintasca.core.model.BaseCITObject;
import it.smartcommunitylab.comuneintasca.core.model.ConfigObject;
import it.smartcommunitylab.comuneintasca.core.model.ContentObject;
import it.smartcommunitylab.comuneintasca.core.model.EventObject;
import it.smartcommunitylab.comuneintasca.core.model.HotelObject;
import it.smartcommunitylab.comuneintasca.core.model.ItineraryObject;
import it.smartcommunitylab.comuneintasca.core.model.MainEventObject;
import it.smartcommunitylab.comuneintasca.core.model.POIObject;
import it.smartcommunitylab.comuneintasca.core.model.RestaurantObject;
import it.smartcommunitylab.comuneintasca.core.service.DataService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.google.protobuf.ByteString;

import eu.trentorise.smartcampus.presentation.common.exception.DataException;
import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.ConfigData;

/**
 * Process data updates
 * @author raman
 *
 */
@Component("dataProcessor")
public class DataProcessor implements ServiceBusListener {

	@Autowired
	private AppManager appManager;
	@Autowired
	private DataService dataService;

	@Autowired
	private DataExtractor dataExtractor;
	
	@Autowired
	private ConnectorStorage connectorStorage;

	@Autowired
	private ConfigProcessor configProcessor;
	
	private static Log logger = LogFactory.getLog(DataProcessor.class);

	@Override
	public void onServiceEvents(String serviceId, String methodName, String subscriptionId, List<ByteString> data) {
		App app = appManager.getApp(serviceId, methodName, subscriptionId);
		if (app == null) return;
		
		SourceEntry entry = app.findEntry(serviceId, methodName, subscriptionId);
		try {
			if (Subscriber.SERVICE_OD.equals(serviceId)) {
				if (Subscriber.METHOD_CONFIG.equals(methodName)) {
					updateConfig(data, app, entry);
				}
				if (Subscriber.METHOD_EVENTS.equals(methodName)) {
					updateEvents(data, app, entry);
				}
				if (Subscriber.METHOD_RESTAURANTS.equals(methodName)) {
					updateRestaurants(data, app, entry);
				}
				if (Subscriber.METHOD_HOTELS.equals(methodName)) {
					updateHotels(data, app, entry);
				}
				if (Subscriber.METHOD_CULTURA.equals(methodName)) {
					updateCultura(data, app, entry);
				}
				if (Subscriber.METHOD_MAINEVENTS.equals(methodName)) {
					updateMainEvents(data, app, entry);
				}
				if (Subscriber.METHOD_TESTI.equals(methodName)) {
					updateTesti(data, app, entry);
				}
				if (Subscriber.METHOD_ITINERARI.equals(methodName)) {
					updateItinerari(data, app, entry);
				}

			}
		} catch (Exception e) {
			logger.error("Error updating " + methodName);
			e.printStackTrace();
		}
	}

	private void updateConfig(List<ByteString> data, App app, SourceEntry entry) throws Exception {
		ConfigData cd = ConfigData.parseFrom(data.get(0));
		String d = cd.getData().replace("\\\"", "");

		ObjectMapper mapper = new ObjectMapper();

		ConfigObject config = mapper.readValue(d, ConfigObject.class);

		try {
			configProcessor.buildConfig(config, app);
		} catch (Exception e) {
			return;
		}

		List<ConfigObject> oldList = dataService.getDraftObjects(ConfigObject.class, app.getId());
		ConfigObject old = null;
		if (oldList != null && !oldList.isEmpty()) {
			old = oldList.get(0);
			if (old.getLastModified() < cd.getDateModified()) {
				config.setId(old.getId());
				config.setAppId(app.getId());
				config.setLastModified(cd.getDateModified());
				connectorStorage.storeObject(config, app.getId());
				
				// update application
				dataService.upsertObject(config, app.getId());
				logger.info("Stored updated config.");
				if (entry.isAutoPublish()) {
					dataService.publishObject(config, app.getId());
					logger.info("Published updated config.");
				}
				updateAll(config, app);
			}
		} else {
			config.setAppId(app.getId());
			config.setLastModified(cd.getDateModified());
			connectorStorage.storeObject(config, app.getId());

			// update application
			dataService.upsertObject(config, app.getId());
			logger.info("Stored new config.");
			if (entry.isAutoPublish()) {
				dataService.publishObject(config, app.getId());
				logger.info("Published new config.");
			}
			updateAll(config, app);
		}

	}

	@SuppressWarnings("rawtypes")
	private void updateAll(ConfigObject config, App app) throws DataException {
		Map<String,ObjectFilters> map = configProcessor.constructFilters(config);
		Map<Class, ObjectFilters> classMap = new HashMap<Class, ObjectFilters>();
		List<AppObject> allObjects = connectorStorage.getAllAppObjects(app.getId());
		for (AppObject o : allObjects) {
			if (o instanceof BaseCITObject) {
				if (!classMap.containsKey(o.getClass())) {
					ObjectFilters filters = null;
					MappingDescriptor md = configProcessor.findDescriptor(o.getClass());
					if (md != null) {
						filters = map.get(md.getLocalType());
					}
					classMap.put(o.getClass(), filters);
				}
				Boolean applies = applies((BaseCITObject)o, classMap.get(o.getClass()));
				AppObject draftObject = dataService.getDraftObject(o.getId(), app.getId());
				if (draftObject != null && !applies) {
					dataService.deleteObject(draftObject, app.getId());
					dataService.unpublishObject(draftObject, app.getId());
				} else if (applies) {
					dataService.upsertObject(o, app.getId());
					SourceEntry entry = app.findEntry(o.getClass().getName(), ((BaseCITObject) o).getClassifier());
					if (entry.isAutoPublish()) {
						dataService.publishObject(o, app.getId()); 
					}
				}
			}
		}
	}	

	private boolean applies(BaseCITObject o, ObjectFilters filters) {
		if (filters == null) return false;
		return filters.applies(o);
	}

	private ObjectFilters getFilters(String key, App app) throws DataException {
		List<ConfigObject> oldList = connectorStorage.getObjectsByType(ConfigObject.class, app.getId());
		if (oldList != null && oldList.size() > 0) {
			ConfigObject old = oldList.get(0);
			Map<String, ObjectFilters> constructFilters = configProcessor.constructFilters(old);
			return constructFilters.get(key);
		}

		return null;
	}
	
	private <T extends AppObject> Set<String> getOldIds(Class<T> cls, String classifier, String appId) throws DataException {
		List<T> oldList = connectorStorage.getObjectsByType(cls, classifier, appId);
		Set<String> oldIds = new HashSet<String>();
		for (T o : oldList) {
			oldIds.add(o.getId());
		}
		return oldIds;
	}


	private <S,T extends BaseCITObject> void updateData(
			List<ByteString> data, 
			App app, 
			SourceEntry entry, 
			String filterType, 
			Class<T> targetCls,
			Extractor<S, T> extractor) throws Exception {
		String classifier = entry.getClassifier();

		Set<String> oldIds = getOldIds(targetCls, classifier, app.getId());
		List<T> toPublish = new ArrayList<T>();
		ObjectFilters filters = getFilters(filterType, app); 
		for (ByteString bs : data) {
			S bt = extractor.readData(bs);
			String id = extractor.getId(bt);
			oldIds.remove(id);
			T old = null;
			try {
				old = connectorStorage.getObjectById(id, targetCls, app.getId());
			} catch (Exception e) {}
			if (old == null || extractor.isNewer(bt, old)) {
				T no = extractor.extractData(bt, entry);
				connectorStorage.storeObject(no, app.getId());
				boolean applies = applies(no, filters);
				if (applies) {
					toPublish.add(no);
				}
			}
		}
		dataService.upsertType(toPublish, targetCls, app.getId(), classifier);
		if (entry.isAutoPublish()) {
			dataService.publishType(targetCls, app.getId(), classifier);
		}
		
		for (String s : oldIds) {
			logger.info("Deleting object " + s);
			connectorStorage.deleteObjectById(s, targetCls, app.getId());
		}

	}
	
	private void updateEvents(List<ByteString> data, App app, SourceEntry entry) throws Exception {
		updateData(data, app, entry, "event", EventObject.class, dataExtractor.eventExtractor);
	}

	private void updateRestaurants(List<ByteString> data, App app, SourceEntry entry) throws Exception {
		updateData(data, app, entry, "restaurant", RestaurantObject.class, dataExtractor.restaurantExtractor);
	}

	private void updateItinerari(List<ByteString> data, App app, SourceEntry entry) throws Exception {
		updateData(data, app, entry, "itineraries", ItineraryObject.class, dataExtractor.itineraryExtractor);
	}

	private void updateTesti(List<ByteString> data, App app, SourceEntry entry) throws Exception {
		updateData(data, app, entry, "content", ContentObject.class, dataExtractor.contentExtractor);
	}

	private void updateMainEvents(List<ByteString> data, App app, SourceEntry entry) throws Exception {
		updateData(data, app, entry, "mainevent", MainEventObject.class, dataExtractor.mainEventExtractor);
	}

	private void updateCultura(List<ByteString> data, App app, SourceEntry entry) throws Exception {
		updateData(data, app, entry, "poi", POIObject.class, dataExtractor.poiExtractor);
	}

	private void updateHotels(List<ByteString> data, App app, SourceEntry entry) throws Exception {
		updateData(data, app, entry, "hotels", HotelObject.class, dataExtractor.hotelExtractor);
	}


}
