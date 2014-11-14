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
package it.smartcommunitylab.comuneintasca.connector;

import it.sayservice.platform.client.InvocationException;
import it.sayservice.platform.client.ServiceBusClient;

import java.util.Map;
import java.util.TreeMap;

import javax.annotation.PostConstruct;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class Subscriber {

	public static final String SERVICE_OD = "smartcampus.service.opendata";
	public static final String METHOD_EVENTS = "GetEventiParam";
	public static final String METHOD_CONFIG = "GetConfig";
	public static final String METHOD_RESTAURANTS = "GetRestaurants";
	public static final String METHOD_HOTELS = "GetHotels";
	public static final String METHOD_CULTURA = "GetCultura";
	public static final String METHOD_MAINEVENTS = "GetMainEvents";
	public static final String METHOD_TESTI = "GetTesti";
	public static final String METHOD_ITINERARI = "GetItinerari";
	public static final String METHOD_TERRITORY_SERVICE = "GetTerritoryServices";

	private ServiceBusClient client;
	
	private Log logger = LogFactory.getLog(getClass());

	public Subscriber(ServiceBusClient client) {
		this.client = client;
	}	
	
	@PostConstruct
	public void subscribe(App app) {
		try {
			logger.info("SUBSCRIBING app "+app.getId());
			for (SourceEntry source : app.getSources()) {
				String serviceId = source.getServiceId();
				String methodName = source.getMethodName();
				if (source.getSubscriptionId() != null) {
					client.unsubscribeService(serviceId, methodName, source.getSubscriptionId());
				}
				Map<String, Object> params = new TreeMap<String, Object>();
				params.put("url", source.getUrl());
				String newSubscriptionId =  client.subscribeService(serviceId, methodName, params);
				source.setSubscriptionId(newSubscriptionId);
			}
			logger.info("DONE SUBSCRIBING app "+app.getId());
		} catch (InvocationException e) {
			logger.error("Failed to subscribe for the app: " + e.getMessage());
		}
	}

	public void unsubscribe(App a) {
		try {
			for (SourceEntry source : a.getSources()) {
				String serviceId = source.getServiceId();
				String methodName = source.getMethodName();
				if (source.getSubscriptionId() != null) {
					client.unsubscribeService(serviceId, methodName, source.getSubscriptionId());
				}
			}
		} catch (InvocationException e) {
			logger.error("Failed to unsubscribe for the app: " + e.getMessage());
		}	
	}
	
}
