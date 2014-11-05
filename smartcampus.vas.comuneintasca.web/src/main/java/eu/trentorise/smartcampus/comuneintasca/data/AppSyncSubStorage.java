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

import java.util.List;
import java.util.Map;
import java.util.SortedMap;

import eu.trentorise.smartcampus.comuneintasca.model.AppObject;
import eu.trentorise.smartcampus.presentation.common.exception.DataException;
import eu.trentorise.smartcampus.presentation.data.SyncData;
import eu.trentorise.smartcampus.presentation.storage.sync.BasicObjectSyncStorage;

public interface AppSyncSubStorage extends BasicObjectSyncStorage {
	
	SyncData getSyncAppData(long since, String appId, Map<String,Object> include, Map<String,Object> exclude) throws DataException;

	public <T extends AppObject> List<T> searchObjects(String appId, Class<T> cls, String text, Map<String, Object> criteria, SortedMap<String,Integer> sort, int limit, int skip) throws DataException; 
	
	public List<AppObject> getAllAppObjects(String appId);
	public AppObject getObjectById(String id, String appId);
	public <T extends AppObject> T getObjectById(String id, Class<T> cls, String appId);

}
