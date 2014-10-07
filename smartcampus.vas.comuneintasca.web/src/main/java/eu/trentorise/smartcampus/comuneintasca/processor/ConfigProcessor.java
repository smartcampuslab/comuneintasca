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
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;

import eu.trentorise.smartcampus.comuneintasca.model.ConfigObject;
import eu.trentorise.smartcampus.network.JsonUtils;
import eu.trentorise.smartcampus.presentation.common.exception.DataException;
import eu.trentorise.smartcampus.presentation.storage.sync.BasicObjectSyncStorage;

public class ConfigProcessor {

	@Autowired
	private BasicObjectSyncStorage storage;

	@Value("${configobject.file}")
	private ClassPathResource configFile;
	private Logger logger = LoggerFactory.getLogger(getClass());

//	@Scheduled(fixedRate = 60000)
	public void updateMessages() {
		if (configFile == null) return;

		try {
			Long lastModified = configFile.lastModified();
			String json = readJson(configFile.getInputStream());
			ConfigObject home = JsonUtils.toObject(json, ConfigObject.class);
			processObject(home, lastModified);
		} catch (Exception e) {
			e.printStackTrace();
			logger .error("Problem reading file: "+ e.getMessage());
		}

	}


	private void processObject(ConfigObject home, Long lastModified) throws DataException {
		List<ConfigObject> oldList = storage.getObjectsByType(ConfigObject.class);
		ConfigObject old = null;
		home.setUpdateTime(lastModified);
		if (oldList != null && !oldList.isEmpty()) {
			old = oldList.get(0);
			if (old.getUpdateTime() < lastModified) {
				home.setId(old.getId());
				storage.storeObject(home);
			}
		} else {
			storage.storeObject(home);
		}
	}


	private String readJson(InputStream is) throws IOException {
		String json = "";
		BufferedReader bin = null;
		try {
			bin = new BufferedReader(new InputStreamReader(is));
			String line = null;
			while ((line = bin.readLine()) != null) {
				json += line + "\n";
			}
		} finally {
			if (bin != null) bin.close();
		}
		return json;
	}
	
//	public static void main(String[] args) throws FileNotFoundException, IOException {
//		String json = new ConfigProcessor().readJson(new FileInputStream("config.json"));
//		System.err.println(new ObjectMapper().writeValueAsString(JsonUtils.toObject(json, ConfigObject.class)));
//	}
}
