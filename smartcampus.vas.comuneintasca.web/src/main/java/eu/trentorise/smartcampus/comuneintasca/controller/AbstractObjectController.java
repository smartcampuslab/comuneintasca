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
package eu.trentorise.smartcampus.comuneintasca.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;

import eu.trentorise.smartcampus.comuneintasca.data.AppSyncStorage;
import eu.trentorise.smartcampus.comuneintasca.model.BaseCITObject;
import eu.trentorise.smartcampus.comuneintasca.model.ObjectFilter;

public class AbstractObjectController {

	private static final String SEARCH_FILTER_PARAM = "filter";

	@Autowired
	protected AppSyncStorage storage;

	protected Log logger = LogFactory.getLog(this.getClass());

	public <T extends BaseCITObject> List<T> getAllObject(String appId, HttpServletRequest request, Class<T> cls) throws Exception {
		try {
			ObjectFilter filterObj = null;
			Map<String, Object> criteria = null;
			String filter = request.getParameter(SEARCH_FILTER_PARAM);
			if (filter != null) {
				filterObj = new ObjectMapper().readValue(filter, ObjectFilter.class);
				criteria = filterObj.getCriteria() != null ? filterObj.getCriteria() : new HashMap<String, Object>();
				if (filterObj.getCategories() != null && !filterObj.getCategories().isEmpty()) {
					criteria.put("category",
							Collections.singletonMap("$in",
									filterObj.getCategories()));
				}
			} else {
				filterObj = new ObjectFilter();
				criteria = Collections.emptyMap();
			}

			if (filterObj.getSkip() == null) {
				filterObj.setSkip(0);
			}
			if (filterObj.getLimit() == null || filterObj.getLimit() < 0) {
				filterObj.setLimit(100);
			} 

			List<T> objects = null;

			objects = storage.searchObjects(appId, (Class<T>) cls,
					filterObj.getText(), criteria, filterObj.getSort(),
					filterObj.getLimit(), filterObj.getSkip());

			if (objects != null) {
				return objects;
			}
		} catch (Exception e) {
			logger.error("failed to find objects: " + e.getMessage());
			e.printStackTrace();
		}
		return Collections.emptyList();
	}

}
