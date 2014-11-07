package eu.trentorise.smartcampus.comuneintasca.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import eu.trentorise.smartcampus.comuneintasca.data.AppSyncStorage;
import eu.trentorise.smartcampus.comuneintasca.model.AppObject;
import eu.trentorise.smartcampus.presentation.common.exception.DataException;

/**
 * Application data manager. Data is represented 
 * with two sets: draft and published. The operations allow for
 * creating/updating draft data, as well as publishing it and unpublishing
 * individual objects.
 * @author raman
 *
 */
@Service 
public class DataService {

	@Autowired
	private AppSyncStorage storage;
	
	/**
	 * Create/Update object draft 
	 * @param obj
	 * @param app
	 * @return update draft object
	 * @throws DataException 
	 */
	public <T extends AppObject> T upsertObject(T obj, String app) throws DataException {
		return storage.storeDraftObject(obj, app);
	}
	/**
	 * Delete specified object from draft
	 * @param obj
	 * @param app
	 * @throws DataException 
	 */
	public <T extends AppObject> void deleteObject(T obj, String app) throws DataException {
		storage.deleteDraftObject(obj, app);
	}
	
	/**
	 * Update all the instances of the specified type and classifier
	 * @param objects
	 * @param cls
	 * @param app
	 * @param classifier
	 * @throws DataException 
	 */
	public <T extends AppObject> void upsertType(List<T> objects, Class<T> cls, String app, String classifier) throws DataException {
		Map<String, Object> criteria = new HashMap<String, Object>();
		if (classifier != null) {
			criteria.put("classifier", classifier);
		}
		List<T> old = storage.searchDraftObjects(app, cls, null, criteria , null, 0, -1);
		Map<String, AppObject> oldIds = new HashMap<String, AppObject>();
		for (AppObject o : old) {
			oldIds.put(o.getId(), o);
		}
		for (AppObject n : objects) {
			AppObject o = oldIds.get(n.getId());
			if (o == null || o.getLastModified() < n.getLastModified()) {
				storage.storeDraftObject(n, app);
			} 
			oldIds.remove(n.getId());
		}
		
		for (String id : oldIds.keySet()) {
			storage.deleteDraftObject(oldIds.get(id), app);
		}
	}
	
	/**
	 * Publish a single object if not yet published, and update the data otherwise.
	 * @param obj
	 * @param app
	 * @throws DataException 
	 */
	public <T extends AppObject> void publishObject(T obj, String app) throws DataException {
		storage.storeObject(obj, app);
	}

	/**
	 * Remove an object from published ones
	 * @param obj
	 * @param app
	 * @throws DataException 
	 */
	public <T extends AppObject> void unpublishObject(T obj, String app) throws DataException {
		storage.deleteObject(obj, app);
	}
	
	/**
	 * Publish all the draft objects of the specified type
	 * @param cls
	 * @param app
	 * @param classifier
	 * @throws DataException 
	 */
	public <T extends AppObject> void publishType(Class<T> cls, String app, String classifier) throws DataException {
		Map<String, Object> criteria = new HashMap<String, Object>();
		if (classifier != null) {
			criteria.put("classifier", classifier);
		}
		List<T> draftObjects = storage.searchDraftObjects(app, cls, null, criteria, null, 0, -1);
		List<T> publishObjects = storage.searchObjects(app, cls, null, criteria, null, 0, -1);

		updatePublish(app, draftObjects, publishObjects);
	}

	private <T extends AppObject> void updatePublish(String app, List<T> draftObjects, List<T> publishObjects) throws DataException {
		Map<String, AppObject> oldIds = new HashMap<String, AppObject>();
		for (AppObject o : publishObjects) {
			oldIds.put(o.getId(), o);
		}
		for (AppObject n : draftObjects) {
			AppObject o = oldIds.get(n.getId());
			if (o == null || o.getLastModified() < n.getLastModified()) {
				storage.storeObject(n, app);
			} 
			oldIds.remove(n.getId());
		}
		
		for (String id : oldIds.keySet()) {
			storage.deleteObject(oldIds.get(id), app);
		}
	}
	
	/**
	 * Publish all the draft data of the specified app
	 * @param app
	 * @throws DataException 
	 */
	public void publishApp(String app) throws DataException {
		List<AppObject> draftObjects = storage.getAllAppDtaftObjects(app);
		List<AppObject> publishObjects = storage.getAllAppObjects(app);
		updatePublish(app, draftObjects, publishObjects);
	}
	
	/**
	 * @param cls
	 * @param app
	 * @return all the published objects of the specified type
	 */
	public <T extends AppObject> List<T> getPublishedObjects(Class<T> cls, String app) {
		try {
			return storage.searchObjects(app, cls, null, null, null, 0, -1);
		} catch (DataException e) {
			return null;
		}
	}
	
	/**
	 * @param cls
	 * @param app
	 * @return all the draft objects of the specified type
	 */
	public <T extends AppObject> List<T> getDraftObjects(Class<T> cls, String app) {
		try {
			return storage.searchDraftObjects(app, cls, null, null, null, 0, -1);
		} catch (DataException e) {
			return null;
		}
	}

	/**
	 * Find specified draft object
	 * @param id
	 * @param app
	 * @return
	 * @throws DataException 
	 */
	public AppObject getDraftObject(String id, String app) throws DataException {
		return storage.getObjectDraftById(id, app);
	}
}
