/*******************************************************************************
 * Copyright 2012-2014 Trento RISE
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

import it.sayservice.platform.client.ServiceBusClient;
import it.sayservice.platform.client.ServiceBusListener;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.protobuf.ByteString;

import eu.trentorise.smartcampus.comuneintasca.listener.Subscriber;
import eu.trentorise.smartcampus.comuneintasca.model.ConfigObject;
import eu.trentorise.smartcampus.comuneintasca.model.ContentObject;
import eu.trentorise.smartcampus.comuneintasca.model.EventObject;
import eu.trentorise.smartcampus.comuneintasca.model.HotelObject;
import eu.trentorise.smartcampus.comuneintasca.model.ItineraryObject;
import eu.trentorise.smartcampus.comuneintasca.model.MainEventObject;
import eu.trentorise.smartcampus.comuneintasca.model.Organization;
import eu.trentorise.smartcampus.comuneintasca.model.POIObject;
import eu.trentorise.smartcampus.comuneintasca.model.RestaurantObject;
import eu.trentorise.smartcampus.presentation.common.exception.DataException;
import eu.trentorise.smartcampus.presentation.data.BasicObject;
import eu.trentorise.smartcampus.presentation.storage.sync.BasicObjectSyncStorage;
import eu.trentorise.smartcampus.service.festivaleconomia.data.message.Festivaleconomia.Trans;
import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.ConfigData;
import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.Evento;
import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.I18nCultura;
import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.I18nHotel;
import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.I18nItinerario;
import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.I18nMainEvent;
import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.I18nRestaurant;
import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.I18nString;
import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.I18nTesto;

public class EventProcessorImpl implements ServiceBusListener {

	@Autowired
	private BasicObjectSyncStorage storage;

	@Autowired
	ServiceBusClient client;

	private static List<String> langs = Arrays.asList(new String[] { "it", "en", "de"});

	private static Log logger = LogFactory.getLog(EventProcessorImpl.class);

	public EventProcessorImpl() {
	}

	@Override
	public void onServiceEvents(String serviceId, String methodName, String subscriptionId, List<ByteString> data) {
		System.out.println(new Date() + " -> " + methodName + "@" + serviceId);
		try {
			if (Subscriber.SERVICE_OD.equals(serviceId)) {
				if (Subscriber.METHOD_EVENTS.equals(methodName)) {
					updateEvents(data);
				}
				if (Subscriber.METHOD_CONFIG.equals(methodName)) {
					updateConfig(data);
				}
				if (Subscriber.METHOD_RESTAURANTS.equals(methodName)) {
					updateRestaurants(data);
				}
				if (Subscriber.METHOD_HOTELS.equals(methodName)) {
					updateHotels(data);
				}
				if (Subscriber.METHOD_CULTURA.equals(methodName)) {
					updateCultura(data);
				}
				if (Subscriber.METHOD_MAINEVENTS.equals(methodName)) {
					updateMainEvents(data);
				}		
				if (Subscriber.METHOD_TESTI.equals(methodName)) {
					updateTesti(data);
				}		
				if (Subscriber.METHOD_ITINERARI.equals(methodName)) {
					updateItinerari(data);
				}					

			}
			if (Subscriber.SERVICE_YMIR.equals(serviceId)) {
				if (Subscriber.METHOD_EVENTS.equals(methodName)) {
					updateEventsYmir(data);
				}

			}
		} catch (Exception e) {
			logger.error("Error updating " + methodName);
			e.printStackTrace();
		}
	}

	private Set<String> getOldIds(String src) throws DataException {
		List<EventObject> oldList = storage.searchObjects(EventObject.class, Collections.<String, Object> singletonMap("source", src));
		Set<String> oldIds = new HashSet<String>();
		for (EventObject o : oldList) {
			oldIds.add(o.getId());
		}
		return oldIds;
	}

	private <T extends BasicObject> Set<String> getOldIds(Class<T> cls) throws DataException {
		List<T> oldList = storage.getObjectsByType(cls);
		Set<String> oldIds = new HashSet<String>();
		for (T o : oldList) {
			oldIds.add(o.getId());
		}
		return oldIds;
	}

	private void updateConfig(List<ByteString> data) throws Exception {
		// TODO many?

		ConfigData cd = ConfigData.parseFrom(data.get(0));
		int hash = cd.getData().hashCode();
		String d = cd.getData().replace("\\\"", "");

		ObjectMapper mapper = new ObjectMapper();

		ConfigObject config = mapper.readValue(d, ConfigObject.class);

		List<ConfigObject> oldList = storage.getObjectsByType(ConfigObject.class);
		ConfigObject old = null;
		if (oldList != null && !oldList.isEmpty()) {
			old = oldList.get(0);
			if (old.getLastModified() < cd.getDateModified()) {
				config.setId(old.getId());
				config.setLastModified(cd.getDateModified());
				storage.storeObject(config);
			}
		} else {
			config.setLastModified(cd.getDateModified());
			storage.storeObject(config);
		}

	}

	private void updateEvents(List<ByteString> data) throws Exception {
		Set<String> oldIds = getOldIds("opendata.trento");

		for (ByteString bs : data) {
			Evento bt = Evento.parseFrom(bs);
			oldIds.remove(bt.getId());
			EventObject old = null;
			try {
				old = storage.getObjectById(bt.getId(), EventObject.class);
			} catch (Exception e) {}
			if (old == null || old.getLastModified() < bt.getLastModified()) {
				EventObject no = new EventObject();
				no.setId(bt.getId());
				no.setAddress(Collections.singletonMap("it", bt.getAddress()));
				no.setCategory(bt.getCategory());
				no.setCost(Collections.singletonMap("it", bt.getCost()));
				no.setDescription(Collections.singletonMap("it", bt.getDescription()));
				no.setDuration(Collections.singletonMap("it", bt.getDuration()));
				no.setEventForm(bt.getEventType());
				no.setEventPeriod(Collections.singletonMap("it", bt.getEventPeriod()));
				no.setEventTiming(Collections.singletonMap("it", bt.getEventTiming()));
				no.setEventType(bt.getCategory());
				no.setFromTime(bt.getFromTime());
				no.setImage(bt.getImage());
				no.setInfo(Collections.singletonMap("it", bt.getInfo()));
				no.setLastModified(bt.getLastModified());
				List<Organization> orgs = new ArrayList<Organization>();
				if (bt.getOrganizationsCount() > 0) {
					for (eu.trentorise.smartcampus.service.opendata.data.message.Opendata.Organization o : bt.getOrganizationsList()) {
						Organization ro = new Organization();
						ro.setOrganizationType(o.getType());
						ro.setTitle(Collections.singletonMap("it", o.getTitle()));
						ro.setUrl(o.getUrl());
					}
				}
				no.setOrganizations(orgs);
				if (bt.hasParentEventId()) {
					no.setParentEventId(bt.getParentEventId());
				}
				no.setShortTitle(Collections.singletonMap("it", bt.getShortTitle()));
				no.setSource("opendata.trento");
				no.setSpecial(bt.getSpecial());
				no.setSubtitle(Collections.singletonMap("it", bt.getSubtitle()));
				no.setTitle(Collections.singletonMap("it", bt.getTitle()));
				no.setTopics(bt.getTopicsList());
				no.setToTime(bt.getToTime());
				no.setUrl(bt.getUrl());

				storage.storeObject(no);
			}
		}
		for (String s : oldIds) {
			logger.info("Deleting event " + s);
			storage.deleteObjectById(s);
		}

	}

	private void updateRestaurants(List<ByteString> data) throws Exception {
		Set<String> oldIds = getOldIds(RestaurantObject.class);

		for (ByteString bs : data) {
			I18nRestaurant bt = I18nRestaurant.parseFrom(bs);
			oldIds.remove(bt.getId());
			RestaurantObject old = null;
			try {
				old = storage.getObjectById(bt.getId(), RestaurantObject.class);
			} catch (Exception e) {}

			if (old == null || old.getLastModified() < bt.getLastModified()) {
				RestaurantObject no = new RestaurantObject();
				no.setId(bt.getId());
				no.setAddress(toMap(bt.getAddress()));
				no.setCategory("ristorazione");
				no.setClassification(toMap(bt.getClassification()));
				no.setClosing(toMap(bt.getClosing()));

				Map<String, String> contacts = new HashMap<String, String>();
				contacts.put("email", bt.getEmail());
				contacts.put("phone", bt.getPhone());
				no.setContacts(contacts);

				no.setDescription(toMap(bt.getDescription()));
				no.setEquipment(toMap(bt.getEquipment()));
				no.setImage(bt.getImage());
				no.setInfo(toMap(bt.getInfo()));
				no.setLastModified(bt.getLastModified());
				no.setLocation(new double[] { bt.getLat(), bt.getLon() });
				no.setPrices(toMap(bt.getPrices()));
				no.setShortTitle(toMap(bt.getShortTitle()));
				no.setSubtitle(toMap(bt.getSubtitle()));
				no.setTimetable(toMap(bt.getTimetable()));
				no.setTitle(toMap(bt.getTitle()));
				no.setUpdateTime(System.currentTimeMillis());
				no.setUrl(bt.getUrl());

				storage.storeObject(no);
			}
		}
		for (String s : oldIds) {
			logger.info("Deleting restaurant " + s);
			storage.deleteObjectById(s);
		}

	}

	private void updateHotels(List<ByteString> data) throws Exception {
		Set<String> oldIds = getOldIds(HotelObject.class);

		for (ByteString bs : data) {
			I18nHotel bt = I18nHotel.parseFrom(bs);
			oldIds.remove(bt.getId());
			HotelObject old = null;
			try {
				old = storage.getObjectById(bt.getId(), HotelObject.class);
			} catch (Exception e) {}

			if (old == null || old.getLastModified() < bt.getLastModified()) {
				HotelObject no = new HotelObject();
				no.setId(bt.getId());
				no.setAddress(toMap(bt.getAddress()));
				no.setCategory("dormire");
				no.setClassification(toMap(bt.getClassification()));

				Map<String, String> contacts = new HashMap<String, String>();
				contacts.put("email", bt.getEmail());
				contacts.put("phone", bt.getPhone());
				contacts.put("phone2", bt.getPhone2());
				contacts.put("fax", bt.getFax());
				no.setContacts(contacts);

				no.setImage(bt.getImage());
				no.setLastModified(bt.getLastModified());
				no.setLocation(new double[] { bt.getLat(), bt.getLon() });
				no.setStars(bt.getStars());
				no.setSubtitle(toMap(bt.getSubtitle()));
				no.setTitle(toMap(bt.getTitle()));
				no.setUpdateTime(System.currentTimeMillis());
				no.setUrl(bt.getUrl());

				storage.storeObject(no);
			}
		}
		for (String s : oldIds) {
			logger.info("Deleting hotel " + s);
			storage.deleteObjectById(s);
		}

	}

	private void updateCultura(List<ByteString> data) throws Exception {
		Set<String> oldIds = getOldIds(POIObject.class);

		for (ByteString bs : data) {
			I18nCultura bt = I18nCultura.parseFrom(bs);
			oldIds.remove(bt.getId());
			POIObject old = null;
			try {
				old = storage.getObjectById(bt.getId(), POIObject.class);
			} catch (Exception e) {}

			if (old == null || old.getLastModified() < bt.getLastModified()) {
				POIObject no = new POIObject();
				no.setId(bt.getId());
				no.setAddress(toMap(bt.getAddress()));
				no.setCategory("cultura");
				// TODO: classification
				no.setClassification(toMap(bt.getClassification()));

				Map<String, String> contacts = new HashMap<String, String>();
				contacts.put("email", bt.getEmail());
				contacts.put("phone", bt.getPhone());
				no.setContacts(contacts);

				no.setDescription(toMap(bt.getDescription()));
				no.setImage(bt.getImage());
				no.setLastModified(bt.getLastModified());
				no.setLocation(new double[] { bt.getLat(), bt.getLon() });

				no.setSubtitle(toMap(bt.getSubtitle()));
				no.setTitle(toMap(bt.getTitle()));
				no.setUpdateTime(System.currentTimeMillis());
				no.setUrl(bt.getUrl());
				no.setContactFullName(bt.getContactFullName());

				storage.storeObject(no);
			}
		}
		for (String s : oldIds) {
			logger.info("Deleting cultura " + s);
			storage.deleteObjectById(s);
		}

	}
	
	private void updateMainEvents(List<ByteString> data) throws Exception {
		Set<String> oldIds = getOldIds(MainEventObject.class);

		for (ByteString bs : data) {
			I18nMainEvent bt = I18nMainEvent.parseFrom(bs);
			oldIds.remove(bt.getId());
			MainEventObject old = null;
			try {
				old = storage.getObjectById(bt.getId(), MainEventObject.class);
			} catch (Exception e) {}

			if (old == null || old.getLastModified() < bt.getLastModified()) {
				MainEventObject no = new MainEventObject();
				no.setId(bt.getId());
				no.setAddress(toMap(bt.getAddress()));
				no.setCategory("event");
				// TODO: classification
				no.setClassification(toMap(bt.getClassification()));

				Map<String, String> contacts = new HashMap<String, String>();
				contacts.put("email", bt.getEmail());
				contacts.put("phone", bt.getPhone());
				no.setContacts(contacts);

				no.setDescription(toMap(bt.getDescription()));
				no.setImage(bt.getImage());
				no.setLastModified(bt.getLastModified());
				no.setLocation(new double[] { bt.getLat(), bt.getLon() });

				no.setSubtitle(toMap(bt.getSubtitle()));
				no.setTitle(toMap(bt.getTitle()));
				no.setUpdateTime(System.currentTimeMillis());
				no.setUrl(bt.getUrl());
				
				no.setFromDate(bt.getFromDate());
				no.setToDate(bt.getToDate());
				no.setEventDateDescription(toMap(bt.getDateDescription()));

				storage.storeObject(no);
			}
		}
		for (String s : oldIds) {
			logger.info("Deleting hotel " + s);
			storage.deleteObjectById(s);
		}

	}	
	
	private void updateTesti(List<ByteString> data) throws Exception {
		Set<String> oldIds = getOldIds(ContentObject.class);

		for (ByteString bs : data) {
			I18nTesto bt = I18nTesto.parseFrom(bs);
			oldIds.remove(bt.getId());
			ContentObject old = null;
			try {
				old = storage.getObjectById(bt.getId(), ContentObject.class);
			} catch (Exception e) {}

			if (old == null || old.getLastModified() < bt.getLastModified()) {
				ContentObject no = new ContentObject();
				no.setId(bt.getId());
				no.setCategory("text");
				// TODO: classification
				no.setClassification(toMap(bt.getClassification()));

				no.setDescription(toMap(bt.getDescription()));
				no.setImage(bt.getImage());
				no.setLastModified(bt.getLastModified());

				no.setSubtitle(toMap(bt.getSubtitle()));
				no.setTitle(toMap(bt.getTitle()));
				no.setUpdateTime(System.currentTimeMillis());
				no.setUrl(bt.getUrl());
				no.setAddress(toMap(bt.getAddress()));
				
				storage.storeObject(no);
			}
		}
		for (String s : oldIds) {
			logger.info("Deleting testi " + s);
			storage.deleteObjectById(s);
		}

	}		
	
	private void updateItinerari(List<ByteString> data) throws Exception {
		Set<String> oldIds = getOldIds(ItineraryObject.class);

		for (ByteString bs : data) {
			I18nItinerario bt = I18nItinerario.parseFrom(bs);
			oldIds.remove(bt.getId());
			ItineraryObject old = null;
			try {
				old = storage.getObjectById(bt.getId(), ItineraryObject.class);
			} catch (Exception e) {}

			if (old == null || old.getLastModified() < bt.getLastModified()) {
				ItineraryObject no = new ItineraryObject();
				no.setId(bt.getId());
				no.setCategory("text");
				// TODO: classification

				no.setDescription(toMap(bt.getDescription()));
				no.setImage(bt.getImage());
				no.setLastModified(bt.getLastModified());

				no.setSubtitle(toMap(bt.getSubtitle()));
				no.setTitle(toMap(bt.getTitle()));
				no.setUpdateTime(System.currentTimeMillis());
				no.setUrl(bt.getUrl());
				
				no.setSteps(bt.getStepsList());
				no.setDifficulty(toMap(bt.getDifficulty()));
				no.setDuration(bt.getDuration());
				no.setLength(bt.getLength());
				
				storage.storeObject(no);
			}
		}
		for (String s : oldIds) {
			logger.info("Deleting testi " + s);
			storage.deleteObjectById(s);
		}

	}		
	

	private void updateEventsYmir(List<ByteString> data) throws Exception {
		Set<String> oldIds = getOldIds("festivaleconomia");

		for (ByteString bs : data) {
			eu.trentorise.smartcampus.service.festivaleconomia.data.message.Festivaleconomia.Evento bt = eu.trentorise.smartcampus.service.festivaleconomia.data.message.Festivaleconomia.Evento.parseFrom(bs);
			EventObject old = null;
			oldIds.remove(bt.getId());
			try {
				old = storage.getObjectById(bt.getId(), EventObject.class);
			} catch (Exception e) {}
			if (old == null || old.getLastModified() < bt.getLastModified()) {
				EventObject no = new EventObject();
				no.setId(bt.getId());
				no.setAddress(convertTranslated(bt.getAddressList()));
				// fix for classification of the app
				// no.setCategory(convertTranslated(bt.getCategoryList()).get("it"));
				no.setCategory("Incontri, convegni e conferenze");
				no.setDescription(convertTranslated(bt.getDescriptionList()));
				no.setFromTime(bt.getFromTime());
				no.setToTime(bt.getToTime());
				no.setImage(bt.getImage());
				no.setLastModified(bt.getLastModified());
				no.setSource("festivaleconomia");
				no.setTitle(convertTranslated(bt.getTitleList()));
				no.setToTime(bt.getToTime());
				no.setUrl(bt.getUrl());
				storage.storeObject(no);
			}
		}

		for (String s : oldIds) {
			logger.info("Deleting event " + s);
			storage.deleteObjectById(s);
		}
	}

	private Map<String, String> convertTranslated(List<Trans> list) {
		Map<String, String> res = new HashMap<String, String>();
		for (Trans t : list) {
			String lang = t.getLang();
			if (lang.isEmpty())
				lang = "it";
			res.put(lang, t.getValue());
		}
		return res;
	}

	private Map<String, String> toMap(I18nString str) {
		Map<String, String> map = new TreeMap<String, String>();
		if (str.hasIt()) {
			map.put("it", str.getIt());
		}
		if (str.hasEn()) {
			map.put("en", str.getEn());
		}
		if (str.hasDe()) {
			map.put("de", str.getDe());
		}
		return map;
	}

	public BasicObjectSyncStorage getStorage() {
		return storage;
	}

	public void setStorage(BasicObjectSyncStorage storage) {
		this.storage = storage;
	}

	public ServiceBusClient getClient() {
		return client;
	}

	public void setClient(ServiceBusClient client) {
		this.client = client;
	}
}
