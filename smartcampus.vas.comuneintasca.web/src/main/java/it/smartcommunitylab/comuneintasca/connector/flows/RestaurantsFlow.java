/*******************************************************************************
 * Copyright 2015 Fondazione Bruno Kessler
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
package it.smartcommunitylab.comuneintasca.connector.flows;

import java.util.LinkedList;
import java.util.List;

import com.google.protobuf.Message;

import eu.trentorise.smartcampus.service.opendata.data.message.Opendata;
import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.I18nRestaurant;
import it.smartcommunitylab.comuneintasca.connector.scripts.OpenContentScript;
import it.smartcommunitylab.comuneintasca.connector.scripts.RestaurantsScript;

/**
 * @author raman
 *
 */
public class RestaurantsFlow implements Flow<I18nRestaurant> {
	
	@Override
	public List<I18nRestaurant> process(String url) throws Exception {
		List<I18nRestaurant> output = new LinkedList<Opendata.I18nRestaurant>();
		
		String mainStr = it.smartcommunitylab.comuneintasca.connector.ConnectionUtils.call(url, String.class);
		OpenContentScript ocs = new OpenContentScript();
		List<String> links = ocs.extractLinks(mainStr);
		for (String link : links) {
			String string = it.smartcommunitylab.comuneintasca.connector.ConnectionUtils.call(link, String.class);
			String stringen = it.smartcommunitylab.comuneintasca.connector.ConnectionUtils.call(link + "?Translation=eng-GB", String.class);
			String stringde = it.smartcommunitylab.comuneintasca.connector.ConnectionUtils.call(link + "?Translation=ger-DE", String.class);
			RestaurantsScript cs = new RestaurantsScript();
			Message data = cs.extractData(string, stringen, stringde);
			output.add((I18nRestaurant)data);
		}
		return output;
	}
}
