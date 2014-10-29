package eu.trentorise.smartcampus.comuneintasca.connector;

import java.util.List;

import eu.trentorise.smartcampus.comuneintasca.model.BaseCITObject;
import eu.trentorise.smartcampus.presentation.data.BasicObject;


public interface ConnectorStorage {

	<T> void storeObject(T obj, String appId);

	List<BaseCITObject> getAllAppObjects(String appId);

	BasicObject getObjectById(String id, String appId);
	<T> T getObjectById(String id, Class<T> cls, String appId);

	<T> List<T> getObjectsByType(Class<T> cls, String appId);
	<T> List<T> getObjectsByType(Class<T> cls, String classifier, String appId);

	<T> void deleteObjectById(String s, Class<T> cls, String id);

}
