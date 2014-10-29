package eu.trentorise.smartcampus.comuneintasca.service;

import java.util.List;

import org.springframework.stereotype.Service;

import eu.trentorise.smartcampus.comuneintasca.model.GeoCITObject;

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

	/**
	 * Create/Update object draft 
	 * @param obj
	 * @param app
	 * @return update draft object
	 */
	public <T> T upsertObject(T obj, String app) {
		// TODO
		return obj;
	}
	/**
	 * Delete specified object from draft
	 * @param obj
	 * @param app
	 */
	public <T> void deleteObject(T obj, String app) {
		
	}
	
	/**
	 * Update all the instances of the specified type and classifier
	 * @param objects
	 * @param cls
	 * @param app
	 * @param classifier
	 */
	public <T> void upsertType(List<T> objects, Class<T> cls, String app, String classifier) {
		// TODO
	}
	
	/**
	 * Publish a single object if not yet published, and update the data otherwise.
	 * @param obj
	 * @param app
	 */
	public <T> void publishObject(T obj, String app) {
		// TODO
	}

	/**
	 * Remove an object from published ones
	 * @param obj
	 * @param app
	 */
	public <T> void unpublishObject(T obj, String app) {
		// TODO
	}
	
	/**
	 * Publish all the draft objects of the specified type
	 * @param cls
	 * @param app
	 * @param classifier
	 */
	public <T> void publishType(Class<T> cls, String app, String classifier) {
		// TODO
	}
	
	/**
	 * @param cls
	 * @param app
	 * @return all the published objects of the specified type
	 */
	public <T> List<T> getPublishedObjects(Class<T> cls, String app) {
		// TODO
		return null;
	}
	
	/**
	 * @param cls
	 * @param app
	 * @return all the draft objects of the specified type
	 */
	public <T> List<T> getDraftObjects(Class<T> cls, String app) {
		// TODO
		return null;
	}

	/**
	 * Find specified draft object
	 * @param id
	 * @param app
	 * @return
	 */
	public GeoCITObject findObject(String id, String app) {
		// TODO Auto-generated method stub
		return null;
	}

}
