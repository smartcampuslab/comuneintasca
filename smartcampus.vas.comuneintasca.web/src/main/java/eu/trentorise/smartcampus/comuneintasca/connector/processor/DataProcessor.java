package eu.trentorise.smartcampus.comuneintasca.connector.processor;

import it.sayservice.platform.client.ServiceBusListener;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.protobuf.ByteString;

import eu.trentorise.smartcampus.comuneintasca.connector.App;
import eu.trentorise.smartcampus.comuneintasca.connector.AppManager;
import eu.trentorise.smartcampus.comuneintasca.connector.ConnectorStorage;
import eu.trentorise.smartcampus.comuneintasca.connector.SourceEntry;
import eu.trentorise.smartcampus.comuneintasca.connector.Subscriber;
import eu.trentorise.smartcampus.comuneintasca.connector.processor.DataExtractor.Extractor;
import eu.trentorise.smartcampus.comuneintasca.data.BadDataException;
import eu.trentorise.smartcampus.comuneintasca.data.MissingDataException;
import eu.trentorise.smartcampus.comuneintasca.model.BaseCITObject;
import eu.trentorise.smartcampus.comuneintasca.model.ConfigObject;
import eu.trentorise.smartcampus.comuneintasca.model.ContentObject;
import eu.trentorise.smartcampus.comuneintasca.model.EventObject;
import eu.trentorise.smartcampus.comuneintasca.model.GeoCITObject;
import eu.trentorise.smartcampus.comuneintasca.model.HotelObject;
import eu.trentorise.smartcampus.comuneintasca.model.ItineraryObject;
import eu.trentorise.smartcampus.comuneintasca.model.MainEventObject;
import eu.trentorise.smartcampus.comuneintasca.model.MenuItem;
import eu.trentorise.smartcampus.comuneintasca.model.MenuItemQuery;
import eu.trentorise.smartcampus.comuneintasca.model.POIObject;
import eu.trentorise.smartcampus.comuneintasca.model.RestaurantObject;
import eu.trentorise.smartcampus.comuneintasca.processor.EventProcessorImpl;
import eu.trentorise.smartcampus.comuneintasca.service.DataService;
import eu.trentorise.smartcampus.presentation.common.exception.DataException;
import eu.trentorise.smartcampus.presentation.data.BasicObject;
import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.ConfigData;

public class DataProcessor implements ServiceBusListener {

	@Autowired
	private AppManager appManager;
	@Autowired
	private DataService dataService;

	@Autowired
	private DataExtractor dataExtractor;
	
	@Autowired
	private ConnectorStorage connectorStorage;

	private static Map<String, MappingDescriptor> descriptors = new HashMap<String, MappingDescriptor>();
	static {
		descriptors.put("event", new EventMappingDescriptor());
		descriptors.put("ristorante",new MappingDescriptor("ristorante", "restaurant", RestaurantObject.class)); 
		descriptors.put("accomodation",new MappingDescriptor("accomodation", "hotel", HotelObject.class)); 
		descriptors.put("iniziativa",new MappingDescriptor("iniziativa", "mainevent", MainEventObject.class, "tipo_evento")); 
		descriptors.put("itinerario",new MappingDescriptor("itinerario", "itineraries", ItineraryObject.class));
		descriptors.put("luogo",new MappingDescriptor("luogo", "poi", POIObject.class, "tipo_luogo")); 
		descriptors.put("testo_generico",new MappingDescriptor("testo_generico", "content", ContentObject.class, "classifications")); 
		descriptors.put("folder",new MappingDescriptor("folder", "content", ContentObject.class, "classifications")); 
	}
	
	private static Log logger = LogFactory.getLog(EventProcessorImpl.class);

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
			completeConfig(config, true, app);
			Map<String, String> idMapping = buildQueryClassification(config);
			fillRef(config, idMapping);
		} catch (Exception e) {
			logger.error("Error processing configuration, not saving");
			e.printStackTrace();
			return;
		}

		List<ConfigObject> oldList = dataService.getDraftObjects(ConfigObject.class, app.getId());
		ConfigObject old = null;
		if (oldList != null && !oldList.isEmpty()) {
			old = oldList.get(0);
			if (old.getLastModified() < cd.getDateModified()) {
				config.setId(old.getId());
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
		Map<String,ObjectFilters> map = constructFilters(config);
		Map<Class, ObjectFilters> classMap = new HashMap<Class, ObjectFilters>();
		List<BaseCITObject> allObjects = connectorStorage.getAllAppObjects(app.getId());
		for (BasicObject o : allObjects) {
			if (o instanceof BaseCITObject) {
				if (!classMap.containsKey(o.getClass())) {
					ObjectFilters filters = null;
					MappingDescriptor md = findDescriptor(o.getClass());
					if (md != null) {
						filters = map.get(md.getLocalType());
					}
					classMap.put(o.getClass(), filters);
				}
				Boolean applies = applies((BaseCITObject)o, classMap.get(o.getClass()));
				GeoCITObject draftObject = dataService.findObject(o.getId(), app.getId());
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

	private void completeConfig(ConfigObject config, boolean retry, App app) throws Exception {
		try {
			setType(config.getHighlights(), app);
			setType(config.getMenu(), app);
			setType(config.getNavigationItems(), app);
		} catch (MissingDataException e) {
			logger.error("Cannot complete config, some objects are missing.");
			throw e;
		}
	}
	
	private void fillRef(ConfigObject config, Map<String, String> idMapping) throws MissingDataException {
		try {
		fillRef(config, config.getHighlights(), idMapping);
		fillRef(config, config.getMenu(), idMapping);
		fillRef(config, config.getNavigationItems(), idMapping);		
		
		removeHighlightRef(config);
	} catch (MissingDataException e) {
		logger.error("Cannot complete references.");
		throw e;
	}		
	}

	private void removeHighlightRef(ConfigObject config) {
		for (MenuItem item : config.getHighlights()) {
			if ((item.getObjectIds() == null || item.getObjectIds().isEmpty()) && item.getRef() != null) {
				MenuItem refItem = findReferredItem(config, item.getRef(), false);
				if (refItem != item) {
					item.setObjectIds(refItem.getObjectIds());
					item.setQuery(refItem.getQuery());
					item.setImage(refItem.getImage());
				}
			}
		}
	}

	private void fillRef(ConfigObject config, List<MenuItem> items, Map<String, String> idMapping) throws MissingDataException {
		for (MenuItem item : items) {
			if (item.getRef() != null && !item.getRef().isEmpty()) {
				MenuItem referred = findReferredItem(config, item.getRef(), true);
				if (referred != null) {
					item.setName(referred.getName());
					item.setRef(referred.getId());
					if (item.getId() == null) {
						item.setId(referred.getId());
					}					
				} else {
					referred = findReferredItem(config, idMapping.get(item.getRef()), true);
					if (referred != null) {
						item.setName(referred.getName());
						item.setRef(referred.getId());
						if (item.getId() == null) {
							item.setId(referred.getId());
						}
					}					
				}
			}
		}
	}

	private MenuItem findReferredItem(ConfigObject config, String ref, boolean highlights) {
		MenuItem referred = null;
		if (highlights) {
		referred = findReferredItem(config.getHighlights(), ref);
		}
		if (referred == null) {
			referred = findReferredItem(config.getMenu(), ref);
		}
		if (referred == null) {
			referred = findReferredItem(config.getNavigationItems(), ref);
		}
		return referred;
	}

	private MenuItem findReferredItem(List<MenuItem> items, String ref) {
		if (ref == null) {
			return null;
		}
		for (MenuItem item : items) {
			if (ref.equals(item.getId())) {
				return item;
			}
			if (item.getItems() != null) {
				MenuItem ref2 = findReferredItem(item.getItems(), ref);
				if (ref2 != null) {
					return ref2;
				}
			}
		}
		return null;
	}

	private void setType(List<MenuItem> items, App app) throws MissingDataException, DataException {
		for (MenuItem item : items) {
			if (item.getId() != null) {
				item.setId(item.getId().replace(" ", "_"));
			}
			if (item.getRef() != null) {
				item.setRef(item.getRef().replace(" ", "_"));
			}
			if (item.getApp() != null) {
				for (String key : item.getApp().keySet()) {
					if (item.getApp().get(key) != null) {
						item.getApp().put(key, item.getApp().get(key).trim());
					}
				}
			}
			
			if (item.getType() == null && item.getQuery() == null && item.getRef() == null && item.getApp() == null) {
				String type = findType(item, app);
				item.setType(type);
				if (type != null) {
					logger.info("Set type to " + type + " for " + ((item.getName() != null) ? item.getName().get("it") : item.getId()));
				} else if (item.getItems() == null || item.getItems().isEmpty())  {
					if (item.getObjectIds() == null || item.getObjectIds().size() != 1 || !item.getObjectIds().contains(item.getId())) {
						logger.error("Missing type for " + ((item.getName() != null) ? item.getName().get("it") : item.getId()));
						throw new MissingDataException("Missing type for " + ((item.getName() != null) ? item.getName().get("it") : item.getId()));
					}
				} 
			}
			if (item.getItems() != null) {
				setType(item.getItems(), app);
			}
		}
	}

	private String findType(MenuItem item, App app) throws MissingDataException, DataException {
		if (item.getType() != null) {
			return item.getType();
		} else if (item.getObjectIds() != null && !item.getObjectIds().isEmpty()) {
			String objectId = item.getObjectIds().get(0);
			BasicObject obj = connectorStorage.getObjectById(objectId, app.getId());
			if (obj != null) {
				MappingDescriptor md = findDescriptor(obj.getClass());
				if (md != null) {
					return md.getLocalType();
				} else {
					if (item.getId().equals(objectId)) {
						logger.warn("Object contains its id in objectIds: " + objectId);
						return null;
					} else {						
						throw new MissingDataException("Missing type for " + objectId + " = " + item.getName());
					}
				}
			} else {
				if (item.getId().equals(objectId)) {
					logger.warn("Object contains its id in objectIds: " + objectId);
					return null;
				} else {
					throw new MissingDataException("Missing type for " + objectId + " = " + item.getName());
				}
			}
		}
		return null;
	}

	private Map<String, String> buildQueryClassification(ConfigObject config) throws BadDataException {
		try {
		Map<String, String> idMapping = new TreeMap<String, String>();
		
		for (MenuItem menu : config.getMenu()) {
			if (menu.getItems() != null) {
				idMapping.putAll(buildQueryClassification(menu.getItems()));
			}
		}
		
		return idMapping;
		} catch (BadDataException e) {
			logger.error("Cannot build query classifications.");
			throw e;
		}
	}

	private Map<String, String> buildQueryClassification(List<MenuItem> items) throws BadDataException {
		Map<String, String> idMapping = new TreeMap<String, String>();
		
		for (MenuItem item : items) {
			MenuItemQuery query = item.getQuery();
			if (query != null) {
				List<Map<String, String>> classifications = query.getClassifications();
				String classification = "";
				String type = query.getType();
				MappingDescriptor md = findDescriptor(type);
				if (md == null) {
					throw new BadDataException("Cannot map " + type + " to internal type");
				}
				String newType = md.getLocalType();
				query.setType(newType);
				if (classifications != null) {
					query.setClassification(md.extractClassification(classifications));
					query.setClassifications(null);
					idMapping.put(item.getId(), classification);
				}
			}
			if (item.getItems() != null) {
				buildQueryClassification(item.getItems());
			}
		}
		
		return idMapping;
	}
	
	private static MappingDescriptor findDescriptor(String type) {
		return descriptors.get(type);
	}
	
	@SuppressWarnings("rawtypes")
	private static MappingDescriptor findDescriptor(Class cls) {
		for (MappingDescriptor md : descriptors.values()) {
			if (cls.equals(md.getLocalClass())) return md;
		}
		return null;
	}
	
	private boolean applies(BaseCITObject o, ObjectFilters filters) {
		if (filters == null) return true;
		return filters.applies(o);
	}

	private Map<String, ObjectFilters> constructFilters(ConfigObject object) {
		Map<String,ObjectFilters> res = new HashMap<String, ObjectFilters>();
		
		constructFilters(object.getHighlights(), res);
		constructFilters(object.getNavigationItems(), res);
		constructFilters(object.getMenu(), res);

		return res;
	}

	private void constructFilters(List<MenuItem> menu, Map<String,ObjectFilters> res) {
		for (MenuItem item : menu) {
			if (item.getObjectIds() != null && !item.getObjectIds().isEmpty()) {
				String type = item.getType();
				if (type != null) {
					ObjectFilters filters = res.get(type);
					if (filters == null) {
						filters = new ObjectFilters();
						res.put(type, filters);
					}
					filters.ids.addAll(item.getObjectIds());
				}
			}
			if (item.getQuery() != null) {
				String type = item.getQuery().getType();
				if (type != null) {
					ObjectFilters filters = res.get(type);
					if (filters == null) {
						filters = new ObjectFilters();
						res.put(type, filters);
					}
					if (StringUtils.isEmpty(item.getQuery().getClassification())) {
						filters.all = true;
					} else {
						filters.classifications.addAll(Arrays.asList(item.getQuery().getClassification().split(";")));
					}
				}
			}
			if (item.getItems() != null) {
				constructFilters(item.getItems(), res);
			}
		}
	}


	private static class ObjectFilters {
		Set<String> ids = new HashSet<String>();
		Set<String> classifications = new HashSet<String>();
		boolean all = false;
		
		boolean applies(BaseCITObject o) {
			if (all) return true;
			if (ids.contains(o.getId())) return true;

			if (o instanceof EventObject) {
				if (classifications.contains(o.getCategory())) return true;
			}
			if (o instanceof POIObject) {
				if (classifications.contains(((POIObject)o).getClassification().get("it"))) return true;
			}
			if (o instanceof ContentObject) {
				if (classifications.contains(((ContentObject)o).getClassification().get("it"))) return true;
			}
			if (o instanceof MainEventObject) {
				if (classifications.contains(((MainEventObject)o).getClassification().get("it"))) return true;
			}
			if (o instanceof RestaurantObject) {
				if (classifications.contains(((RestaurantObject)o).getClassification().get("it"))) return true;
			}
			if (o instanceof HotelObject) {
				if (classifications.contains(((HotelObject)o).getClassification().get("it"))) return true;
			}

			return false;
		}
	}
	
	private ObjectFilters getFilters(String key, App app) throws DataException {
		List<ConfigObject> oldList = connectorStorage.getObjectsByType(ConfigObject.class, app.getId());
		if (oldList != null && oldList.size() > 0) {
			ConfigObject old = oldList.get(0);
			Map<String, ObjectFilters> constructFilters = constructFilters(old);
			return constructFilters.get(key);
		}

		return null;
	}
	
	private <T extends BasicObject> Set<String> getOldIds(Class<T> cls, String classifier, String appId) throws DataException {
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
				T no = extractor.extractData(bt);
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
