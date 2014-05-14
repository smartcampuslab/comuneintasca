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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import eu.trentorise.smartcampus.comuneintasca.model.ContentObject;
import eu.trentorise.smartcampus.comuneintasca.model.HotelObject;
import eu.trentorise.smartcampus.comuneintasca.model.ItineraryObject;
import eu.trentorise.smartcampus.comuneintasca.model.MainEventObject;
import eu.trentorise.smartcampus.comuneintasca.model.POIObject;
import eu.trentorise.smartcampus.comuneintasca.model.RestaurantObject;
import eu.trentorise.smartcampus.network.RemoteException;
import eu.trentorise.smartcampus.presentation.common.exception.DataException;
import eu.trentorise.smartcampus.presentation.common.exception.NotFoundException;
import eu.trentorise.smartcampus.presentation.storage.sync.BasicObjectSyncStorage;

public class ObjectProcessor {

	private Logger logger = LoggerFactory.getLogger(getClass());
	
	private static final SimpleDateFormat lastModifiedFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm aa Z");
	
	@Autowired
	private BasicObjectSyncStorage storage;

	@Autowired
	private ItineraryGenerator itineraryGenerator;
	
	@Autowired
	@Value("${imageFolderPrefix}")
	private String imagePrefix;
	
	@PostConstruct
	public void init() {
		try {
			updatePOIs();
			updateContents();
			updateRestaurants();
			updateHotels();
			updateItineraries();
			updateMainEvents();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	private void updateMainEvents() throws Exception {
		List<MainEventObject> contents = parseMainEventObjects();
		for (MainEventObject content : contents) {
			MainEventObject old = null;
			try {
				old = storage.getObjectById(content.getId(), MainEventObject.class);
			} catch (Exception e) {}
			if (old == null || old.getLastModified() < content.getLastModified()) {
				storage.storeObject(content);
			}
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

	private void updateRestaurants() throws Exception {
		List<RestaurantObject> restaurants = parseRestaurantObjects();
		for (RestaurantObject r : restaurants) {
			RestaurantObject old = null;
			try {
				old = storage.getObjectById(r.getId(), RestaurantObject.class);
			} catch (Exception e) {}
			if (old == null || old.getLastModified() < r.getLastModified()) {
				storage.storeObject(r);
			}
		}
	}
	private void updateHotels() throws Exception {
		List<HotelObject> hotels = parseHotelObjects();
		for (HotelObject h : hotels) {
			HotelObject old = null;
			try {
				old = storage.getObjectById(h.getId(), HotelObject.class);
			} catch (Exception e) {}
			if (old == null || old.getLastModified() < h.getLastModified()) {
				storage.storeObject(h);
			}
		}
	}
	private void updateItineraries() throws Exception {
		List<ItineraryObject> itins = parseItineraryObjects();
		for (ItineraryObject i : itins) {
			ItineraryObject old = null;
			try {
				old = storage.getObjectById(i.getId(), ItineraryObject.class);
			} catch (Exception e) {}
			if (old == null || old.getLastModified() < i.getLastModified()) {
				storage.storeObject(i);
			}
		}
	}

	private List<MainEventObject> parseMainEventObjects() throws Exception {
		List<MainEventObject> objects = new ArrayList<MainEventObject>();
		List<List<String>> rows = ODFParser.parseTable("/mainevents/mainevents.ods", 29);
		for (List<String> row : rows) {
			objects.add(convertMainEventObject(row));
		}
		return objects;
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

	private List<RestaurantObject> parseRestaurantObjects() throws Exception {
		List<RestaurantObject> contents = new ArrayList<RestaurantObject>();
		List<List<String>> rows = ODFParser.parseTable("/restaurant/restaurants.ods", 34);
		for (List<String> row : rows) {
			contents.add(convertRestaurantObject(row));
		}
		return contents;
	}

	private List<HotelObject> parseHotelObjects() throws Exception {
		List<HotelObject> contents = new ArrayList<HotelObject>();
		List<List<String>> rows = ODFParser.parseTable("/hotel/hotels.ods", 26);
		for (List<String> row : rows) {
			contents.add(convertHotelObject(row));
		}
		return contents;
	}

	private List<ItineraryObject> parseItineraryObjects() throws Exception {
		List<ItineraryObject> contents = new ArrayList<ItineraryObject>();
		List<List<String>> rows = ODFParser.parseTable("/itinerary/itineraries.ods", 21);
		for (List<String> row : rows) {
			contents.add(convertItineraryObject(row));
		}
		return contents;
	}

	private RestaurantObject convertRestaurantObject(List<String> row) throws ParseException {
		RestaurantObject r = new RestaurantObject();
		r.setId(row.get(0));
		r.setCategory(row.get(2));
		Map<String,String> classifications = new HashMap<String, String>();
		classifications.put("it", row.get(3));
		classifications.put("de", row.get(4));
		classifications.put("en", row.get(5));
		r.setClassification(classifications);
		
		Map<String,String> titles = new HashMap<String, String>();
		titles.put("it", row.get(6));
		r.setTitle(titles);
		
		Map<String,String> addresses = new HashMap<String, String>();
		addresses.put("it", row.get(7));
		addresses.put("de", row.get(8));
		addresses.put("en", row.get(9));
		r.setAddress(addresses);
		r.setUrl(row.get(11));
		
		Map<String,String> contacts = new HashMap<String, String>();
		contacts.put("email", row.get(12));
		contacts.put("phone", row.get(10));
		r.setContacts(contacts);

		Map<String,String> timetable = new HashMap<String, String>();
		timetable.put("it", row.get(13));
		timetable.put("de", row.get(14));
		timetable.put("en", row.get(15));
		r.setTimetable(timetable);

		Map<String,String> closing = new HashMap<String, String>();
		closing.put("it", row.get(16));
		closing.put("de", row.get(17));
		closing.put("en", row.get(18));
		r.setClosing(closing);

		Map<String,String> prices = new HashMap<String, String>();
		prices.put("it", row.get(19));
		prices.put("de", row.get(20));
		prices.put("en", row.get(21));
		r.setPrices(prices);

		Map<String,String> equ = new HashMap<String, String>();
		equ.put("it", row.get(22));
		equ.put("de", row.get(23));
		equ.put("en", row.get(24));
		r.setEquipment(equ);

		if (!StringUtils.isEmpty(row.get(25))) {
			r.setImage(imagePrefix+"/"+row.get(25));
		}
		
		Map<String,String> shortDesc = new HashMap<String, String>();
		shortDesc.put("it", row.get(26));
		shortDesc.put("de", row.get(27));
		shortDesc.put("en", row.get(28));
		r.setDescription(shortDesc);
		
		if (!StringUtils.isEmpty(row.get(31)) && !StringUtils.isEmpty(row.get(32))) {
			r.setLocation(new double[]{Double.parseDouble(row.get(31)),Double.parseDouble(row.get(32))});
		}
		r.setLastModified(lastModifiedFormat.parse(row.get(33)).getTime());
		return r;
	}

	private HotelObject convertHotelObject(List<String> row) throws ParseException {
		HotelObject r = new HotelObject();
		r.setId(row.get(0));
		r.setCategory(row.get(2));
		Map<String,String> classifications = new HashMap<String, String>();
		classifications.put("it", row.get(3));
		classifications.put("de", row.get(4));
		classifications.put("en", row.get(5));
		r.setClassification(classifications);
		
		Map<String,String> titles = new HashMap<String, String>();
		titles.put("it", row.get(6));
		r.setTitle(titles);

		if (!StringUtils.isEmpty(row.get(7))) {
			r.setStars(Integer.parseInt(row.get(7)));
		}
		
		Map<String,String> addresses = new HashMap<String, String>();
		addresses.put("it", row.get(8));
		addresses.put("de", row.get(9));
		addresses.put("en", row.get(10));
		r.setAddress(addresses);
		r.setUrl(row.get(11));
		
		Map<String,String> contacts = new HashMap<String, String>();
		contacts.put("email", row.get(12));
		contacts.put("phone", row.get(13));
		contacts.put("phone2", row.get(14));
		contacts.put("fax", row.get(15));
		r.setContacts(contacts);
		if (!StringUtils.isEmpty(row.get(16))) {
			r.setImage(imagePrefix+"/"+row.get(16));
		}

		Map<String,String> shortDesc = new HashMap<String, String>();
		shortDesc.put("it", row.get(17));
		shortDesc.put("de", row.get(18));
		shortDesc.put("en", row.get(19));
		r.setDescription(shortDesc);
		
		if (!StringUtils.isEmpty(row.get(22)) && !StringUtils.isEmpty(row.get(23))) {
			r.setLocation(new double[]{Double.parseDouble(row.get(22)),Double.parseDouble(row.get(23))});
		}
		r.setLastModified(lastModifiedFormat.parse(row.get(25)).getTime());
		return r;
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
		p.setContactFullName(row.get(24));
		p.setLastModified(lastModifiedFormat.parse(row.get(25)).getTime());
		return p;
	}
	private ItineraryObject convertItineraryObject(List<String> row) throws ParseException, NotFoundException, DataException, SecurityException, RemoteException {
		ItineraryObject p = new ItineraryObject();
		p.setId(row.get(0));
		p.setCategory(row.get(2));
		
		Map<String,String> titles = new HashMap<String, String>();
		titles.put("it", row.get(3));
		titles.put("de", row.get(4));
		titles.put("en", row.get(5));
		p.setTitle(titles);

		Map<String,String> subtitles = new HashMap<String, String>();
		subtitles.put("it", row.get(6));
		subtitles.put("de", row.get(7));
		subtitles.put("en", row.get(8));
		p.setTitle(titles);

		if (!StringUtils.isEmpty(row.get(9))) {
			p.setImage(imagePrefix+"/"+row.get(9));
		}
		
		String steps = row.get(10);
		String[] elems = steps.split(",");
		if (elems != null && elems.length > 0) {
			List<String> ids = new ArrayList<String>();
			for (int i = 0; i < elems.length; i++) {
				String elem = elems[i];
				ids.add(storage.getObjectById(elem).getId());
			}
			p.setSteps(ids);
		}
		
		if (!StringUtils.isEmpty(row.get(11))) {
			p.setLength(Integer.parseInt(row.get(11)));
		}
		if (!StringUtils.isEmpty(row.get(12))) {
			p.setDuration(Integer.parseInt(row.get(12)));
		}
		if (!StringUtils.isEmpty(row.get(13))) {
			p.setDifficulty(row.get(13));
		}

		Map<String,String> infos = new HashMap<String, String>();
		infos.put("it", row.get(14));
		infos.put("de", row.get(15));
		infos.put("en", row.get(16));
		p.setInfo(infos);

		Map<String,String> shortDesc = new HashMap<String, String>();
		shortDesc.put("it", row.get(17));
		shortDesc.put("de", row.get(18));
		shortDesc.put("en", row.get(19));
		p.setDescription(shortDesc);
		
		p.setLastModified(lastModifiedFormat.parse(row.get(20)).getTime());
		
		p.setStepLines(itineraryGenerator.generateSteps(p));
		
		return p;
	}

	private MainEventObject convertMainEventObject(List<String> row) throws ParseException {
		MainEventObject p = new MainEventObject();
		p.setId(row.get(0));
		p.setCategory(row.get(2));

		Map<String,String> classification = new HashMap<String, String>();
		classification.put("it", row.get(3));
		classification.put("de", row.get(4));
		classification.put("en", row.get(5));
		p.setClassification(classification);

		Map<String,String> titles = new HashMap<String, String>();
		titles.put("it", row.get(6));
		titles.put("de", row.get(7));
		titles.put("en", row.get(8));
		p.setTitle(titles);

		Map<String,String> address = new HashMap<String, String>();
		address.put("it", row.get(9));
		address.put("de", row.get(10));
		address.put("en", row.get(11));
		p.setAddress(address);

		p.setUrl(row.get(12));
		Map<String,String> contacts = new HashMap<String, String>();
		contacts.put("email", row.get(13));
		contacts.put("phone", row.get(14));
		p.setContacts(contacts);
		
		if (!StringUtils.isEmpty(row.get(16))) {
			p.setImage(imagePrefix+"/"+row.get(16));
		}
		
		Map<String,String> shortDesc = new HashMap<String, String>();
		shortDesc.put("it", row.get(17));
		shortDesc.put("de", row.get(18));
		shortDesc.put("en", row.get(19));
		p.setDescription(shortDesc);
		
		p.setLastModified(lastModifiedFormat.parse(row.get(20)).getTime());
		
		if (!StringUtils.isEmpty(row.get(22)) && !StringUtils.isEmpty(row.get(23))) {
			p.setLocation(new double[]{Double.parseDouble(row.get(22)),Double.parseDouble(row.get(23))});
		}

		p.setFromDate(lastModifiedFormat.parse(row.get(24)).getTime());
		p.setToDate(lastModifiedFormat.parse(row.get(25)).getTime());
		
		Map<String,String> timeDesc = new HashMap<String, String>();
		timeDesc.put("it", row.get(26));
		timeDesc.put("de", row.get(27));
		timeDesc.put("en", row.get(28));
		p.setEventDateDescription(timeDesc);

		return p;
	}

}
