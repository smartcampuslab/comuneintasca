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
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.protobuf.ByteString;

import eu.trentorise.smartcampus.comuneintasca.listener.Subscriber;
import eu.trentorise.smartcampus.comuneintasca.model.EventObject;
import eu.trentorise.smartcampus.comuneintasca.model.Organization;
import eu.trentorise.smartcampus.presentation.storage.sync.BasicObjectSyncStorage;
import eu.trentorise.smartcampus.service.festivaleconomia.data.message.Festivaleconomia.Trans;
import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.Evento;


public class EventProcessorImpl implements ServiceBusListener {

	@Autowired
	private BasicObjectSyncStorage storage;
	
	@Autowired
	ServiceBusClient client;
	

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
	
	private void updateEvents(List<ByteString> data) throws Exception {
		for (ByteString bs : data) {
			Evento bt = Evento.parseFrom(bs);
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
		
	}

	private void updateEventsYmir(List<ByteString> data) throws Exception {
		for (ByteString bs : data) {
			eu.trentorise.smartcampus.service.festivaleconomia.data.message.Festivaleconomia.Evento bt = eu.trentorise.smartcampus.service.festivaleconomia.data.message.Festivaleconomia.Evento.parseFrom(bs);
			EventObject old = null;
			try {
				old = storage.getObjectById(bt.getId(), EventObject.class);
			} catch (Exception e) {}
			if (old == null || old.getLastModified() < bt.getLastModified()) {
				EventObject no = new EventObject();
				no.setId(bt.getId());
				no.setAddress(convertTranslated(bt.getAddressList()));
				// fix for classification of the app
				//no.setCategory(convertTranslated(bt.getCategoryList()).get("it"));
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
		
	}

	private Map<String,String> convertTranslated(List<Trans> list) {
		Map<String,String> res = new HashMap<String, String>();
		for (Trans t : list) {
			String lang = t.getLang();
			if (lang.isEmpty()) lang = "it";
			res.put(lang, t.getValue());
		}
		return res;
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
