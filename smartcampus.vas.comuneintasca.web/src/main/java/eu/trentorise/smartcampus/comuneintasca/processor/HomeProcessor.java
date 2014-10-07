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
package eu.trentorise.smartcampus.comuneintasca.processor;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;

import eu.trentorise.smartcampus.comuneintasca.model.HomeObject;
import eu.trentorise.smartcampus.network.JsonUtils;
import eu.trentorise.smartcampus.presentation.common.exception.DataException;
import eu.trentorise.smartcampus.presentation.storage.sync.BasicObjectSyncStorage;

public class HomeProcessor {

	@Autowired
	private BasicObjectSyncStorage storage;

	@Value("${homeobject.file}")
	private ClassPathResource feedFile;
	private Logger logger = LoggerFactory.getLogger(getClass());

//	@Scheduled(fixedRate = 60000)
	public void updateMessages() {

		if (feedFile == null) return;

		try {
			String json = readJson();
			HomeObject home = JsonUtils.toObject(json, HomeObject.class);
			processObject(home);
		} catch (Exception e) {
			logger .error("Problem reading file: "+ e.getMessage());
		}

	}


	private void processObject(HomeObject home) throws DataException {
		List<HomeObject> oldList = storage.getObjectsByType(HomeObject.class);
		HomeObject old = null;
		if (oldList != null && !oldList.isEmpty()) {
			old = oldList.get(0);
			if (!old.getContentIds().equals(home.getContentIds())) {
				old.setContentIds(home.getContentIds());
				storage.storeObject(old);
			}
		} else {
			storage.storeObject(home);
		}
	}


	private String readJson() throws IOException {
		String json = "";
		BufferedReader bin = null;
		try {
			bin = new BufferedReader(new InputStreamReader(feedFile.getInputStream()));
			String line = null;
			while ((line = bin.readLine()) != null) {
				json += line + "\n";
			}
		} finally {
			if (bin != null) bin.close();
		}
		return json;
	}
}
