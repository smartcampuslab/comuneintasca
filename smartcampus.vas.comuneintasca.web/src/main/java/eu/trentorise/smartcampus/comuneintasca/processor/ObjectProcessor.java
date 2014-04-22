package eu.trentorise.smartcampus.comuneintasca.processor;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import eu.trentorise.smartcampus.comuneintasca.model.ContentObject;
import eu.trentorise.smartcampus.comuneintasca.model.POIObject;
import eu.trentorise.smartcampus.presentation.storage.sync.BasicObjectSyncStorage;

public class ObjectProcessor {

	private static final SimpleDateFormat lastModifiedFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm aa Z");
	
	@Autowired
	private BasicObjectSyncStorage storage;

	@Autowired
	@Value("${imageFolderPrefix}")
	private String imagePrefix;
	
	@PostConstruct
	public void init() {
		try {
			updatePOIs();
			updateContents();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	private void updateContents() throws Exception {
		List<ContentObject> contents = parseContentObjects();
		for (ContentObject content : contents) {
			ContentObject old = null;
			try {
				old = storage.getObjectById(content.getId(), ContentObject.class);
			} catch (Exception e) {}
			if (old == null || old.getLastModified() < content.getLastModified()) {
				storage.storeObject(content);
			}
		}
	}

	private void updatePOIs() throws Exception {
		List<POIObject> pois = parsePOIObjects();
		for (POIObject poi : pois) {
			POIObject old = null;
			try {
				old = storage.getObjectById(poi.getId(), POIObject.class);
			} catch (Exception e) {}
			if (old == null || old.getLastModified() < poi.getLastModified()) {
				storage.storeObject(poi);
			}
		}
	}

	private List<POIObject> parsePOIObjects() throws Exception {
		List<POIObject> pois = new ArrayList<POIObject>();
		List<List<String>> rows = ODFParser.parseTable("/cultura/cultura.ods", 27);
		for (List<String> row : rows) {
			pois.add(convertPOIObject(row));
		}
		return pois;
	}

	private List<ContentObject> parseContentObjects() throws Exception {
		List<ContentObject> contents = new ArrayList<ContentObject>();
		List<List<String>> rows = ODFParser.parseTable("/content/testi.ods", 20);
		for (List<String> row : rows) {
			contents.add(convertContentObject(row));
		}
		return contents;
	}

	private ContentObject convertContentObject(List<String> row) throws ParseException {
		ContentObject p = new ContentObject();
		p.setId(row.get(0));
		p.setCategory(row.get(2));
		p.setClassification(row.get(3));
		
		Map<String,String> titles = new HashMap<String, String>();
		titles.put("it", row.get(4));
		titles.put("de", row.get(5));
		titles.put("en", row.get(6));
		p.setTitle(titles);
		
		p.setAddress(Collections.singletonMap("it", row.get(7)));
		p.setUrl(row.get(8));
		Map<String,String> contacts = new HashMap<String, String>();
		contacts.put("email", row.get(9));
		contacts.put("phone", row.get(10));
		p.setContacts(contacts);
		if (!StringUtils.isEmpty(row.get(12))) {
			p.setImage(imagePrefix+"/"+row.get(12));
		}
		
		Map<String,String> shortDesc = new HashMap<String, String>();
		shortDesc.put("it", row.get(13));
		shortDesc.put("de", row.get(14));
		shortDesc.put("en", row.get(15));
		p.setDescription(shortDesc);
		
		Map<String,String> htmlDesc = new HashMap<String, String>();
		htmlDesc.put("it", row.get(17));
		htmlDesc.put("de", row.get(18));
		htmlDesc.put("en", row.get(19));
		p.setInfo(htmlDesc);
		p.setLastModified(lastModifiedFormat.parse(row.get(16)).getTime());
		return p;
	}

	private POIObject convertPOIObject(List<String> row) throws ParseException {
		POIObject p = new POIObject();
		p.setId(row.get(0));
		p.setCategory(row.get(2));
		Map<String,String> classifications = new HashMap<String, String>();
		classifications.put("it", row.get(3));
		classifications.put("de", row.get(4));
		classifications.put("en", row.get(5));
		p.setClassification(classifications);
		
		Map<String,String> titles = new HashMap<String, String>();
		titles.put("it", row.get(6));
		titles.put("de", row.get(7));
		titles.put("en", row.get(8));
		p.setTitle(titles);
		
		p.setAddress(Collections.singletonMap("it", row.get(9)));
		p.setUrl(row.get(10));
		Map<String,String> contacts = new HashMap<String, String>();
		contacts.put("email", row.get(11));
		contacts.put("phone", row.get(12));
		p.setContacts(contacts);
		p.setRelatedObjectId(row.get(13));
		if (!StringUtils.isEmpty(row.get(14))) {
			p.setImage(imagePrefix+"/"+row.get(14));
		}
		
		Map<String,String> shortDesc = new HashMap<String, String>();
		shortDesc.put("it", row.get(15));
		shortDesc.put("de", row.get(16));
		shortDesc.put("en", row.get(17));
		p.setDescription(shortDesc);
		
		Map<String,String> htmlDesc = new HashMap<String, String>();
		htmlDesc.put("it", row.get(18));
		htmlDesc.put("de", row.get(19));
		htmlDesc.put("en", row.get(20));
		p.setInfo(htmlDesc);
		if (!StringUtils.isEmpty(row.get(22)) && !StringUtils.isEmpty(row.get(23))) {
			p.setLocation(new double[]{Double.parseDouble(row.get(22)),Double.parseDouble(row.get(23))});
		}
		p.setContackFullName(row.get(24));
		p.setLastModified(lastModifiedFormat.parse(row.get(25)).getTime());
		return p;
	}
}
