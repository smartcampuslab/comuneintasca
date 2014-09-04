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

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

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

	private Log logger = LogFactory.getLog(getClass());

	public Subscriber(ServiceBusClient client) {
		try {
			logger.info("SUBSCRIBE");
			Map<String, Object> params = new TreeMap<String, Object>();
			params.put("url", "http://www.comune.trento.it/api/opendata/v1/content/class/event/offset/0/limit/1000");
			client.subscribeService(SERVICE_OD, METHOD_EVENTS, params);

			params.put("url", "http://trento.opencontent.it/comuneintasca/data");
			client.subscribeService(SERVICE_OD, METHOD_CONFIG, params);

			params.put("url", "http://trento.opencontent.it/api/opendata/v1/content/node/754329/list/limit/1000");
			client.subscribeService(SERVICE_OD, METHOD_RESTAURANTS, params);

			params.put("url", "http://trento.opencontent.it/api/opendata/v1/content/node/754211/list/limit/1000");
			client.subscribeService(SERVICE_OD, METHOD_HOTELS, params);

			params.put("url", "http://trento.opencontent.it/api/opendata/v1/content/node/754058/list/limit/1000");
			client.subscribeService(SERVICE_OD, METHOD_CULTURA, params);

			params.put("url", "http://trento.opencontent.it/api/opendata/v1/content/node/754317/list/limit/1000");
			client.subscribeService(SERVICE_OD, METHOD_MAINEVENTS, params);

			params.put("url", "http://trento.opencontent.it/api/opendata/v1/content/node/754015/list/limit/1000");
			client.subscribeService(SERVICE_OD, METHOD_TESTI, params);

			params.put("url", "http://trento.opencontent.it/api/opendata/v1/content/node/754330/list/limit/1000");
			client.subscribeService(SERVICE_OD, METHOD_ITINERARI, params);

			client.subscribeService(SERVICE_YMIR, METHOD_EVENTS, params);
		} catch (InvocationException e) {
			logger.error("Failed to subscribe for service events: " + e.getMessage());
		}
	}
}
