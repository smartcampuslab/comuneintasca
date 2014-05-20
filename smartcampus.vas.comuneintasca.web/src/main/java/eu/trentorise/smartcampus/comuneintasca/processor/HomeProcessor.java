package eu.trentorise.smartcampus.comuneintasca.processor;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.scheduling.annotation.Scheduled;

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

	@Scheduled(fixedRate = 60000)
	public void updateMessages() {
		logger.info("Refresh home object");

		if (feedFile == null) return;

		try {
			String json = readJson();
			logger.info("Refresh home object: "+json);
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
