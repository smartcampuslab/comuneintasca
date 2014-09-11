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
import org.springframework.core.io.Resource;
import org.springframework.scheduling.annotation.Scheduled;

import eu.trentorise.smartcampus.comuneintasca.model.ConfigObject;
import eu.trentorise.smartcampus.comuneintasca.model.HomeObject;
import eu.trentorise.smartcampus.network.JsonUtils;
import eu.trentorise.smartcampus.presentation.common.exception.DataException;
import eu.trentorise.smartcampus.presentation.storage.sync.BasicObjectSyncStorage;

public class HomeProcessor {

	@Autowired
	private BasicObjectSyncStorage storage;

	@Value("${homeobject.file}")
	private Resource feedFile;
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Value("${configobject.file}")
	private Resource configFile;

	@Scheduled(fixedRate = 60000)
	public void updateMessages() {
		System.err.println(feedFile == null ? "NULL FEED": feedFile.getFilename());
		System.err.println(configFile == null ? "NULL CONFIG": configFile.getFilename());

		if (feedFile != null) {
			try {
				String json = readJson();
				HomeObject home = JsonUtils.toObject(json, HomeObject.class);
				processObject(home);
			} catch (Exception e) {
				logger .error("Problem reading file: "+ e.getMessage());
			}
			
			if (configFile == null) {
				return;
			}
		}

		if (configFile != null) {
			try {
				Long lastModified = configFile.lastModified();
				String json = readJson(configFile.getInputStream());
				ConfigObject home = JsonUtils.toObject(json, ConfigObject.class);
				processConfig(home, lastModified);
			} catch (Exception e) {
				e.printStackTrace();
				logger .error("Problem reading file: "+ e.getMessage());
			}
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
	
	private void processConfig(ConfigObject home, Long lastModified) throws DataException {
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

}
