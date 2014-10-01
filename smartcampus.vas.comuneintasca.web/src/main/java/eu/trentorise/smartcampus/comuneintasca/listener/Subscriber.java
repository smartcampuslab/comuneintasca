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
package eu.trentorise.smartcampus.comuneintasca.listener;

import it.sayservice.platform.client.InvocationException;
import it.sayservice.platform.client.ServiceBusClient;

import java.util.Map;
import java.util.TreeMap;

import javax.annotation.PostConstruct;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

public class Subscriber {

	public static final String SERVICE_YMIR = "smartcampus.service.festivaleconomia";
	public static final String SERVICE_OD = "smartcampus.service.opendata";
	public static final String METHOD_EVENTS = "GetEventi";
	public static final String METHOD_CONFIG = "GetConfig";
	public static final String METHOD_RESTAURANTS = "GetRestaurants";
	public static final String METHOD_HOTELS = "GetHotels";
	public static final String METHOD_EDIFICI = "GetEdifici";
	public static final String METHOD_CULTURA = "GetCultura";
	public static final String METHOD_MAINEVENTS = "GetMainEvents";
	public static final String METHOD_TESTI = "GetTesti";
	public static final String METHOD_ITINERARI = "GetItinerari";

	@Autowired
	@Value("${url.config}")
	private String configURL;
	
	@Autowired
	@Value("${url.events}")
	private String eventsURL;	
	
	@Autowired
	@Value("${url.cultura}")
	private String culturaURL;	
	
	@Autowired
	@Value("${url.hotel}")
	private String hotelURL;	
	
	@Autowired
	@Value("${url.itinerari}")
	private String itinerariURL;	
	
	@Autowired
	@Value("${url.mainevents}")
	private String maineventsURL;	
	
	@Autowired
	@Value("${url.ristoranti}")
	private String ristorantiURL;	
	
	@Autowired
	@Value("${url.testi}")
	private String testiURL;		
	
	private ServiceBusClient client;
	
	private Log logger = LogFactory.getLog(getClass());

	public Subscriber(ServiceBusClient client) {
		this.client = client;
	}	
	
	@PostConstruct
	public void subscribe() {
		try {
			logger.info("SUBSCRIBE");
			Map<String, Object> params = new TreeMap<String, Object>();
			params.put("url", eventsURL);
			client.subscribeService(SERVICE_OD, METHOD_EVENTS, params);

			params.put("url", configURL);
			client.subscribeService(SERVICE_OD, METHOD_CONFIG, params);

			params.put("url", ristorantiURL);
			client.subscribeService(SERVICE_OD, METHOD_RESTAURANTS, params);

			params.put("url", hotelURL);
			client.subscribeService(SERVICE_OD, METHOD_HOTELS, params);

			params.put("url", culturaURL);
			client.subscribeService(SERVICE_OD, METHOD_CULTURA, params);

			params.put("url", maineventsURL);
			client.subscribeService(SERVICE_OD, METHOD_MAINEVENTS, params);

			params.put("url", testiURL);
			client.subscribeService(SERVICE_OD, METHOD_TESTI, params);

			params.put("url", itinerariURL);
			client.subscribeService(SERVICE_OD, METHOD_ITINERARI, params);

//			client.subscribeService(SERVICE_YMIR, METHOD_EVENTS, params);
		} catch (InvocationException e) {
			logger.error("Failed to subscribe for service events: " + e.getMessage());
		}
	}
}
