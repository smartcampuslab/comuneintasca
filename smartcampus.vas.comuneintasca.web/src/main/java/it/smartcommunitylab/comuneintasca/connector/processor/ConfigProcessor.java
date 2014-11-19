package it.smartcommunitylab.comuneintasca.connector.processor;

import it.smartcommunitylab.comuneintasca.connector.App;
import it.smartcommunitylab.comuneintasca.connector.ConnectorStorage;
import it.smartcommunitylab.comuneintasca.core.model.AppObject;
import it.smartcommunitylab.comuneintasca.core.model.BaseCITObject;
import it.smartcommunitylab.comuneintasca.core.model.DynamicConfigObject;
import it.smartcommunitylab.comuneintasca.core.model.ContentObject;
import it.smartcommunitylab.comuneintasca.core.model.EventObject;
import it.smartcommunitylab.comuneintasca.core.model.HotelObject;
import it.smartcommunitylab.comuneintasca.core.model.ItineraryObject;
import it.smartcommunitylab.comuneintasca.core.model.MainEventObject;
import it.smartcommunitylab.comuneintasca.core.model.MenuItem;
import it.smartcommunitylab.comuneintasca.core.model.MenuItemQuery;
import it.smartcommunitylab.comuneintasca.core.model.POIObject;
import it.smartcommunitylab.comuneintasca.core.model.RestaurantObject;
import it.smartcommunitylab.comuneintasca.core.model.TerritoryServiceObject;
import it.smartcommunitylab.comuneintasca.core.model.TypeConstants;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import eu.trentorise.smartcampus.presentation.common.exception.DataException;

/**
 * Process and extract data from the configuration object
 * @author raman
 *
 */
@Component
public class ConfigProcessor {

	@Autowired
	private ConnectorStorage connectorStorage;
	
	private static Map<String, MappingDescriptor> descriptors = new HashMap<String, MappingDescriptor>();
	static {
		descriptors.put("event", new EventMappingDescriptor());
		descriptors.put("ristorante",new MappingDescriptor("ristorante", TypeConstants.TYPE_RESTAURANT, RestaurantObject.class, "tipo_ristorante")); 
		descriptors.put("accomodation",new MappingDescriptor("accomodation", TypeConstants.TYPE_HOTEL, HotelObject.class,"tipo_alloggio")); 
		descriptors.put("iniziativa",new MappingDescriptor("iniziativa", TypeConstants.TYPE_MAINEVENT, MainEventObject.class, "tipo_evento")); 
		descriptors.put("itinerario",new MappingDescriptor("itinerario", TypeConstants.TYPE_ITINERARY, ItineraryObject.class));
		descriptors.put("luogo",new MappingDescriptor("luogo", TypeConstants.TYPE_POI, POIObject.class, "tipo_luogo")); 
		descriptors.put("testo_generico",new MappingDescriptor("testo_generico", TypeConstants.TYPE_CONTENT, ContentObject.class, "classifications")); 
		descriptors.put("folder",new MappingDescriptor("folder", TypeConstants.TYPE_CONTENT, ContentObject.class, "classifications")); 
		descriptors.put("servizio_sul_territorio",new MappingDescriptor("servizio_sul_territorio", TypeConstants.TYPE_TERRITORY_SERVICE, TerritoryServiceObject.class, "tipo_servizio_sul_territorio", "tipo_luogo")); 
	}
	
	private static Log logger = LogFactory.getLog(ConfigProcessor.class);

	
	/**
	 * Post-process configuration object: update node types, 
	 * inline in the references, 
	 * check the explicit objectIds exist,
	 * update query classification
	 * @param config
	 * @param app
	 * @throws Exception
	 */
	public void buildConfig(DynamicConfigObject config, App app) throws Exception {
		try {
			completeConfig(config, true, app);
			Map<String, String> idMapping = buildQueryClassification(config);
			fillRef(config, idMapping);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Error processing configuration, not saving");
			throw e;
		}

	}
	
	private void completeConfig(DynamicConfigObject config, boolean retry, App app) throws Exception {
		try {
			setType(config.getHighlights(), app);
			setType(config.getMenu(), app);
			setType(config.getNavigationItems(), app);
		} catch (MissingDataException e) {
			logger.error("Cannot complete config, some objects are missing.");
			throw e;
		}
	}
	
	private void fillRef(DynamicConfigObject config, Map<String, String> idMapping) throws MissingDataException {
		try {
		fillRef(config, config.getHighlights(), idMapping);
		fillRef(config, config.getMenu(), idMapping);
		fillRef(config, config.getNavigationItems(), idMapping);		
		
		removeHighlightRef(config);
	} catch (MissingDataException e) {
		e.printStackTrace();
		logger.error("Cannot complete references.");
		throw e;
	}		
	}

	private void removeHighlightRef(DynamicConfigObject config) {
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

	private void fillRef(DynamicConfigObject config, List<MenuItem> items, Map<String, String> idMapping) throws MissingDataException {
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

	private MenuItem findReferredItem(DynamicConfigObject config, String ref, boolean highlights) {
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
		for (Iterator<MenuItem> menuIterator = items.iterator(); menuIterator.hasNext();) {
			MenuItem item = menuIterator.next();
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
//				if (item.getObjectIds() != null && !item.getObjectIds().isEmpty()) {
//					for (Iterator<String> iterator = item.getObjectIds().iterator(); iterator.hasNext();) {
//						String objectId = iterator.next();
//						AppObject objs = connectorStorage.getObjectById(objectId, app.getId());
//						if (objs == null) {
//							iterator.remove();
//						}
//					}
//					if (item.getObjectIds().isEmpty()) {
//						logger.warn("Removing item "+item.getId());
//						menuIterator.remove();
//						continue;
//					}
//				}
				
				String type = null;
				try {
					type = findType(item, app);
				} catch (MissingDataException e) {
					logger.error(e.getMessage());
				}
				if (type != null) {
					item.setType(type);
					logger.info("Set type to " + type + " for " + ((item.getName() != null) ? item.getName().get("it") : item.getId()));
//				} else if (item.getItems() == null || item.getItems().isEmpty())  {
//					if (item.getObjectIds() == null || item.getObjectIds().size() != 1 || !item.getObjectIds().contains(item.getId())) {
//						logger.error("Missing type for " + ((item.getName() != null) ? item.getName().get("it") : item.getId()));
//						throw new MissingDataException("Missing type for " + ((item.getName() != null) ? item.getName().get("it") : item.getId()));
//					}
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
			AppObject obj = connectorStorage.getObjectById(objectId, app.getId());
			if (obj != null) {
				MappingDescriptor md = findDescriptor(obj.getClass());
				if (md != null) {
					return md.getLocalType();
				} else {
					throw new MissingDataException("Missing type for " + objectId + " = " + item.getName());
				}
			} else {
				throw new MissingDataException("Missing type for " + objectId + " = " + item.getName());
			}
		}
		return null;
	}

	private Map<String, String> buildQueryClassification(DynamicConfigObject config) throws BadDataException {
		try {
		Map<String, String> idMapping = new TreeMap<String, String>();
		
		for (MenuItem menu : config.getMenu()) {
			if (menu.getItems() != null) {
				idMapping.putAll(buildQueryClassification(menu.getItems()));
			}
		}
		
		return idMapping;
		} catch (BadDataException e) {
			e.printStackTrace();
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
	
	private MappingDescriptor findDescriptor(String type) {
		return descriptors.get(type);
	}
	
	/**
	 * Find mapping descriptor of the specific class
	 * @param cls
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public MappingDescriptor findDescriptor(Class cls) {
		for (MappingDescriptor md : descriptors.values()) {
			if (cls.equals(md.getLocalClass())) return md;
		}
		return null;
	}
	
	/**
	 * Extract filters for the configuration
	 * @param object
	 * @return
	 */
	public Map<String, ObjectFilters> constructFilters(DynamicConfigObject object) {
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

	public static class ObjectFilters {
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
	
}
