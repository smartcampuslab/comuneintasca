/*******************************************************************************
 * Copyright 2012-2013 Trento RISE
 * 
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 * 
 *        http://www.apache.org/licenses/LICENSE-2.0
 * 
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 ******************************************************************************/
package eu.trentorise.smartcampus.comuneintasca.data;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.SortedMap;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.geo.Circle;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Order;
import org.springframework.data.mongodb.core.query.Query;

import com.mongodb.BasicDBObjectBuilder;
import com.mongodb.Mongo;

import eu.trentorise.smartcampus.comuneintasca.model.BaseCITObject;
import eu.trentorise.smartcampus.comuneintasca.model.ConfigObject;
import eu.trentorise.smartcampus.comuneintasca.model.GeoCITObject;
import eu.trentorise.smartcampus.comuneintasca.model.MenuItem;
import eu.trentorise.smartcampus.comuneintasca.model.MenuItemQuery;
import eu.trentorise.smartcampus.presentation.common.exception.DataException;
import eu.trentorise.smartcampus.presentation.data.BasicObject;
import eu.trentorise.smartcampus.presentation.storage.sync.mongo.GenericObjectSyncMongoStorage;

public class GeoTimeStorage extends GenericObjectSyncMongoStorage<GeoTimeSyncObjectBean> implements GeoTimeObjectSyncStorage {

	protected Log logger = LogFactory.getLog(this.getClass());

	public GeoTimeStorage(MongoOperations mongoTemplate) {
		super(mongoTemplate);
		mongoTemplate.getCollection(mongoTemplate.getCollectionName(GeoTimeSyncObjectBean.class)).ensureIndex(BasicDBObjectBuilder.start("location", "2d").get());
	}

	@Override
	public Class<GeoTimeSyncObjectBean> getObjectClass() {
		return GeoTimeSyncObjectBean.class;
	}

	private static <T> Criteria createSearchCriteria(Class<T> cls, Circle circle, Long from, Long to, Map<String, Object> inCriteria, String text) {
		Criteria criteria = new Criteria();
		if (cls != null) {
			criteria.and("type").is(cls.getCanonicalName());
		}
		criteria.and("deleted").is(false);
		if (inCriteria != null) {
			for (String key : inCriteria.keySet()) {
				criteria.and("content." + key).is(inCriteria.get(key));
			}
		}
		if (circle != null) {
			criteria.and("location").within(circle);
		}
		if (text != null && !text.isEmpty()) {
			Criteria[] or = new Criteria[3];
			or[0] = new Criteria("content.title").regex(text.toLowerCase(), "i");
			or[1] = new Criteria("content.description").regex(text.toLowerCase(), "i");
			or[2] = new Criteria("content.poi.street").regex(text.toLowerCase(), "i");
			criteria.orOperator(or);
		}

		if (from != null || to != null) {
			if (from != null) {
				criteria.and("toTime").gte(from);
			}
			if (to != null) {
				criteria.and("fromTime").lte(to);
			}
		}
		return criteria;
	}

	@Override
	public <T extends BaseCITObject> List<T> searchObjects(Class<T> inCls, Circle circle, String text, Long from, Long to, Map<String, Object> inCriteria, SortedMap<String, Integer> sort) throws DataException {
		return searchObjects(inCls, circle, text, from, to, inCriteria, sort, 0, 0);
	}

	@SuppressWarnings("unchecked")
	@Override
	public <T extends BaseCITObject> List<T> searchObjects(Class<T> inCls, Circle circle, String text, Long from, Long to, Map<String, Object> inCriteria, SortedMap<String, Integer> sort, int limit, int skip) throws DataException {
		Criteria criteria = createSearchCriteria(inCls, circle, from, to, inCriteria, text);
		Query query = Query.query(criteria);
		if (limit > 0)
			query.limit(limit);
		if (skip > 0)
			query.skip(skip);
		if (sort != null && !sort.isEmpty()) {
			for (String key : sort.keySet()) {
				Order order = sort.get(key) > 0 ? Order.ASCENDING : Order.DESCENDING;
				query.sort().on("content." + key, order);
			}
		}

		Class<T> cls = inCls;
		if (cls == null)
			cls = (Class<T>) BaseCITObject.class;

		return find(query, cls);
	}

	@Override
	public List<GeoTimeSyncObjectBean> genericSearch(Map<String, Object> inCriteria) {
		Criteria criteria = new Criteria();
		if (inCriteria != null) {
			for (String key : inCriteria.keySet()) {
				criteria.and("content." + key).is(inCriteria.get(key));
			}
		}
		Query query = Query.query(criteria);

		List<GeoTimeSyncObjectBean> result = mongoTemplate.find(query, GeoTimeSyncObjectBean.class);

		return result;
	}

	@Override
	protected <T extends BasicObject> GeoTimeSyncObjectBean convertToObjectBean(T object) throws InstantiationException, IllegalAccessException {
		GeoTimeSyncObjectBean bean = super.convertToObjectBean(object);
		if (object instanceof GeoCITObject) {
			bean.setLocation(((GeoCITObject) object).getLocation());
		}
		return bean;
	}

	public static void main(String[] args) {
		// Criteria c = createSearchCriteria(GeoTimeSyncObjectBean.class, null,
		// Long.MAX_VALUE, null, new HashMap<String, Object>(), "text");
		// System.err.println(c.getCriteriaObject());
		// List<GeoTimeSyncObjectBean> result =
		// gts.genericSearch(Collections.<String, Object>
		// singletonMap("objectId", new Long(774903)));
		// System.out.println(result);
		// for (GeoTimeSyncObjectBean obj: result) {
		// System.out.println(obj.getContent().get("category"));
		// }

		try {
			MongoTemplate mongoTemplate = new MongoTemplate(new Mongo(), "comuneintasca");
			GeoTimeStorage gts = new GeoTimeStorage(mongoTemplate);

			List<ConfigObject> cos = gts.getObjectsByType(ConfigObject.class);
			ConfigObject co = cos.get(0);

			gts.completeConfig(co);
			gts.buildQueryClassification(co);
			gts.replaceObjectIds(co);

			System.out.println();

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private void completeConfig(ConfigObject config) {
		for (MenuItem menu : config.getMenu()) {
			if (menu.getItems() != null) {
				try {
					setType(menu.getItems());
				} catch (MissingDataException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
	}

	private void setType(List<MenuItem> items) throws MissingDataException {
		for (MenuItem item : items) {
			if (item.getType() == null && item.getQuery() == null) {
				String type = findType(item);
				item.setType(type);
				if (type != null) {
					logger.info("Set type to " + type + " for " + ((item.getName() != null) ? item.getName().get("it") : item.getId()));
				} else if (item.getItems() == null || item.getItems().isEmpty()) {
					logger.error("Missing type for " + ((item.getName() != null) ? item.getName().get("it") : item.getId()));
				}
			}
			if (item.getItems() != null) {
				setType(item.getItems());
			}
		}
	}

	private String findType(MenuItem item) throws MissingDataException {
		String res = null;
		if (item.getType() != null) {
			res = item.getType();
		} else if (item.getObjectIds() != null && !item.getObjectIds().isEmpty()) {
			String objectId = item.getObjectIds().get(0);
			List<GeoTimeSyncObjectBean> objs = genericSearch(Collections.<String, Object> singletonMap("objectId", objectId));
			if (objs != null && !objs.isEmpty()) {
				res = (String) objs.get(0).getContent().get("category");
			} else {
				// throw new MissingDataException();
			}
		}

		return res;
	}

	private void buildQueryClassification(ConfigObject config) throws BadDataException {
		for (MenuItem menu : config.getMenu()) {
			buildQueryClassification(Collections.singletonList(menu));
		}
	}

	private void buildQueryClassification(List<MenuItem> items) throws BadDataException {
		List<String> keys = Arrays.asList(new String[] { "event", "ristorante", "accomodation" });
		List<String> values = Arrays.asList(new String[] { "tipo_evento", "tipo_locale", "tipologia_hotel" });
		String typePrefix = "eu.trentorise.smartcampus.comuneintasca.model.";
		List<String> toType = Arrays.asList(new String[] { "EventObject", "RestaurantObject", "HotelObject" });

		for (MenuItem item : items) {
			MenuItemQuery query = item.getQuery();
			if (query != null) {
				List<Map<String, String>> classifications = query.getClassifications();
				String classification = "";
				String type = query.getType();

				// ex: index = -1
				System.err.println("#" + type);
				int index = keys.indexOf(type);
				if (index == -1) {
					throw new BadDataException("Cannot map " + type + " to internal type");
				}
				String classKey = values.get(index);
				String newType = typePrefix + toType.get(index);
				query.setType(newType);
				if (classifications != null) {
					for (Map<String, String> classifics : classifications) {
						String val = classifics.get(classKey);
						if (val != null) {
							classification += val + ";";
						}
						System.err.println(val);
					}
					if (classification.endsWith(";")) {
						classification = classification.substring(0, classification.length() - 1);
					}
					query.setClassification(classification);
				}
				System.err.println("\t" + newType + " = " + classification);
			}
			if (item.getItems() != null) {
				buildQueryClassification(item.getItems());
			}
		}
	}

	private void replaceObjectIds(ConfigObject config) {
		for (MenuItem menu : config.getMenu()) {
			replaceObjectIds(menu);
		}
		for (MenuItem menu : config.getHighlights()) {
			replaceObjectIds(menu);
		}
		for (MenuItem menu : config.getNavigationItems()) {
			replaceObjectIds(menu);
		}
	}

	private void replaceObjectIds(MenuItem item) {
		List<String> newObjectId = new ArrayList<String>();
		if (item.getObjectIds() != null) {
			System.err.println(item.getName().get("it") + " = " + item.getObjectIds());
			for (String objectId : item.getObjectIds()) {
				List<GeoTimeSyncObjectBean> objs = genericSearch(Collections.<String, Object> singletonMap("objectId", objectId));
				if (objs != null && !objs.isEmpty()) {
					String res = (String) objs.get(0).getContent().get("id");
					System.err.println(objectId + " -> " + res);
					newObjectId.add(res);
				} else {
					System.err.println("!!!");
				}
			}
			System.err.println(item.getObjectIds());
			item.setObjectIds(newObjectId);
		}
		if (item.getItems() != null) {
			for (MenuItem item2 : item.getItems()) {
				replaceObjectIds(item2);
			}
		}
	}

}
