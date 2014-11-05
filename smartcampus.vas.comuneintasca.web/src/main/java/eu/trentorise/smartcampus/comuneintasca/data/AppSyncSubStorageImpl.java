package eu.trentorise.smartcampus.comuneintasca.data;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.SortedMap;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Order;
import org.springframework.data.mongodb.core.query.Query;

import eu.trentorise.smartcampus.comuneintasca.model.AppObject;
import eu.trentorise.smartcampus.presentation.common.exception.DataException;
import eu.trentorise.smartcampus.presentation.data.BasicObject;
import eu.trentorise.smartcampus.presentation.data.SyncData;
import eu.trentorise.smartcampus.presentation.storage.sync.mongo.GenericObjectSyncMongoStorage;

public class AppSyncSubStorageImpl extends GenericObjectSyncMongoStorage<AppSyncBean> implements AppSyncSubStorage{

	protected String collectionName;
	
	public AppSyncSubStorageImpl(MongoOperations mongoTemplate, String collectionName) {
		super(mongoTemplate);
		this.collectionName = collectionName;
	}

	@Override
	public String getCollectionName(Class<?> cls) {
		return collectionName;
	}

	@Override
	public Class<AppSyncBean> getObjectClass() {
		return AppSyncBean.class;
	}

	@Override
	public SyncData getSyncAppData(long since, String appId, Map<String, Object> include, Map<String, Object> exclude) throws DataException {
		return retrieveSyncData(appId, since, include, exclude);
	}

	@SuppressWarnings("unchecked")
	@Override
	public <T extends AppObject> List<T> searchObjects(String appId,
			Class<T> inCls, String text, 
			Map<String, Object> inCriteria, SortedMap<String, Integer> sort,
			int limit, int skip) throws DataException 
	{
		Criteria criteria = createSearchCriteria(appId, inCls, inCriteria, text);
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
			cls = (Class<T>) AppObject.class;

		return find(query, cls);
	}

	private <T> Criteria createSearchCriteria(String appId, Class<T> cls, Map<String, Object> inCriteria, String text) {
		Criteria criteria = createBaseCriteria(appId);
		if (cls != null) {
			criteria.and("type").is(cls.getCanonicalName());
		}
		criteria.and("deleted").is(false);
		if (inCriteria != null) {
			for (String key : inCriteria.keySet()) {
				criteria.and("content." + key).is(inCriteria.get(key));
			}
		}
		if (text != null && !text.isEmpty()) {
			Criteria[] or = new Criteria[3];
			or[0] = new Criteria("content.title").regex(text.toLowerCase(), "i");
			or[1] = new Criteria("content.description").regex(text.toLowerCase(), "i");
			or[2] = new Criteria("content.poi.street").regex(text.toLowerCase(), "i");
			criteria.orOperator(or);
		}

		return criteria;
	}


	@Override
	public List<AppObject> getAllAppObjects(String appId)  throws DataException{
		Criteria criteria = createBaseCriteria(appId);
		return find(Query.query(criteria), (Class<AppObject>) AppObject.class);
	}

	@Override
	public AppObject getObjectById(String id, String appId) throws DataException {
		Criteria criteria = createBaseCriteria(appId);
		criteria.and("objectId").is(id);
		List<AppObject> objs = find(Query.query(criteria), (Class<AppObject>) AppObject.class);
		return objs == null || objs.size() == 0 ? null : objs.get(0);
	}

	@Override
	public <T extends AppObject> T getObjectById(String id, Class<T> cls, String appId)  throws DataException{
		Criteria criteria = createBaseCriteria(appId);
		criteria.and("objectId").is(id);
		List<T> objs = find(Query.query(criteria), cls);
		return objs == null || objs.size() == 0 ? null : objs.get(0);
	}

	protected <T> Criteria createBaseCriteria(String appId) {
		Criteria criteria = new Criteria();
		criteria.and("appId").is(appId);
		return criteria;
	}

	@SuppressWarnings("unchecked")
	private SyncData retrieveSyncData(String appId, long since, Map<String, Object> include, Map<String, Object> exclude) {
		long newVersion = getVersion();
		SyncData syncData = new SyncData();
		syncData.setVersion(newVersion);
		List<AppSyncBean> list = searchWithVersion(appId, since-1, newVersion, include, exclude);
		if (list != null && !list.isEmpty()) {
			Map<String,List<BasicObject>> updated = new HashMap<String, List<BasicObject>>();
			Map<String,List<String>> deleted = new HashMap<String, List<String>>();
			for (AppSyncBean sob : list) {
				if (sob.isDeleted()) {
					List<String> deletedList = deleted.get(sob.getType());
					if (deletedList == null) {
						deletedList = new ArrayList<String>();
						deleted.put(sob.getType(), deletedList);
					}
					deletedList.add(sob.getObjectId());
				} else {
					List<BasicObject> updatedList = updated.get(sob.getType());
					if (updatedList == null) {
						updatedList = new ArrayList<BasicObject>();
						updated.put(sob.getType(), updatedList);
					}
					try {
						BasicObject b = convertBeanToBasicObject(sob, (Class<? extends AppObject>)Thread.currentThread().getContextClassLoader().loadClass(sob.getType()));
						updatedList.add(b);
					} catch (ClassNotFoundException e) {
						continue;
					}
					
				}
			}
			syncData.setDeleted(deleted);
			syncData.setUpdated(updated);
		}
		return syncData;
	}

	private List<AppSyncBean> searchWithVersion(String appId, long fromVersion, long toVersion, Map<String, Object> include, Map<String, Object> exclude) {
		Criteria criteria = new Criteria();
		criteria.and("appId").is(appId);
		criteria.and("version").gt(fromVersion).lt(toVersion); 
		if (include != null && !include.isEmpty()) {
			for (String key : include.keySet()) {
				Object value = include.get(key);
				if (value instanceof Collection) {
					criteria.and("content."+key).in((Collection<?>)value);
				} else {
					criteria.and("content."+key).is(value);
				}
			}
		}
		if (exclude != null && !exclude.isEmpty()) {
			for (String key : exclude.keySet()) {
				Object value = exclude.get(key);
				if (value instanceof Collection) {
					criteria.and("content."+key).nin((Collection<?>)value);
				} else {
					criteria.and("content."+key).ne(value);
				}
			}
		}
		return mongoTemplate.find(Query.query(criteria), getObjectClass(), getCollectionName(getObjectClass()));
	}

	@Override
	public <T extends AppObject> T storeObject(T obj, String appId) throws DataException {
		obj.setObjectId(obj.getId());
		
		AppSyncBean old = getBean(obj, appId);

		try {
			obj.setVersion(getNewVersion());
			AppSyncBean newObj = convertToObjectBean(obj);
			if (old != null) {
				newObj.setId(old.getId());
			} else {
				newObj.setId(new ObjectId().toString());
			}
			mongoTemplate.save(newObj);
			return obj;
		} catch (Exception e) {
			e.printStackTrace();
			throw new DataException(e.getMessage());
		}
		
	}

	private <T extends AppObject> AppSyncBean getBean(T obj, String appId) {
		AppSyncBean old = null;
		Criteria criteria = createBaseCriteria(appId);
		criteria.and("objectId").is(obj.getObjectId());
		List<AppSyncBean> result = mongoTemplate.find(Query.query(criteria), getObjectClass(), getCollectionName(getObjectClass())); 
		if (result != null && !result.isEmpty()) {
			old = result.get(0);
		}
		return old;
	}

	@Override
	public <T extends AppObject> void deleteObject(T obj, String appId)  throws DataException {
		obj.setVersion(getNewVersion());
		AppSyncBean old = getBean(obj, appId);

		try {
			AppSyncBean newObj = convertToObjectBean(obj);
			if (old != null) {
				newObj.setId(old.getId());
			} else {
				newObj.setId(new ObjectId().toString());
			}
			newObj.setDeleted(true);
			mongoTemplate.save(newObj);
		} catch (Exception e) {
			e.printStackTrace();
			throw new DataException(e.getMessage());
		}
	}
	
}
