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
package it.smartcommunitylab.comuneintasca.core.data;

import it.smartcommunitylab.comuneintasca.core.model.AppObject;

import java.util.List;
import java.util.Map;
import java.util.SortedMap;

import org.springframework.data.geo.Circle;

import eu.trentorise.smartcampus.presentation.common.exception.DataException;
import eu.trentorise.smartcampus.presentation.data.SyncData;

public interface AppSyncStorage {
	
	SyncData getSyncAppData(long since, String appId, Map<String,Object> include, Map<String,Object> exclude) throws DataException;
	SyncData getSyncAppDraftData(long since, String appId, Map<String,Object> include, Map<String,Object> exclude) throws DataException;

	public <T extends AppObject> List<T> searchObjects(String appId, Class<T> cls, 
			Circle circle,
			String text, 
			String lang,
			Long from, Long to, 
			Map<String, Object> criteria, 
			SortedMap<String,Integer> sort, int limit, int skip) throws DataException; 
	public <T extends AppObject> List<T> searchDraftObjects(String appId, Class<T> cls, 
			Circle circle,
			String text, 
			String lang,
			Long from, Long to, 
			Map<String, Object> criteria, 
			SortedMap<String,Integer> sort, int limit, int skip) throws DataException; 
	
	public List<AppObject> getAllAppObjects(String appId) throws DataException;
	public AppObject getObjectById(String id, String appId) throws DataException;
	public <T extends AppObject> T getObjectById(String id, Class<T> cls, String appId) throws DataException;

	public List<AppObject> getAllAppDtaftObjects(String appId) throws DataException;
	public AppObject getObjectDraftById(String id, String appId) throws DataException;
	public <T extends AppObject> T getObjectDraftById(String id, Class<T> cls, String appId) throws DataException;
	
	public <T extends AppObject> T storeObject(T obj, String appId) throws DataException;
	public <T extends AppObject> void deleteObject(T obj, String appId) throws DataException;

	public <T extends AppObject> T storeDraftObject(T obj, String appId) throws DataException;
	public <T extends AppObject> void deleteDraftObject(T obj, String appId) throws DataException;
}
