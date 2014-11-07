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
package eu.trentorise.smartcampus.comuneintasca.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import eu.trentorise.smartcampus.comuneintasca.model.DynamicConfigObject;
import eu.trentorise.smartcampus.comuneintasca.model.ContentObject;
import eu.trentorise.smartcampus.comuneintasca.model.EventObject;
import eu.trentorise.smartcampus.comuneintasca.model.HomeObject;
import eu.trentorise.smartcampus.comuneintasca.model.HotelObject;
import eu.trentorise.smartcampus.comuneintasca.model.ItineraryObject;
import eu.trentorise.smartcampus.comuneintasca.model.MainEventObject;
import eu.trentorise.smartcampus.comuneintasca.model.POIObject;
import eu.trentorise.smartcampus.comuneintasca.model.RestaurantObject;
import eu.trentorise.smartcampus.presentation.common.exception.DataException;

@Controller
public class ObjectController extends AbstractObjectController {

	@RequestMapping(method = RequestMethod.GET, value = "/events")
	public @ResponseBody List<EventObject> getAllEvents() throws DataException {
		return storage.getObjectsByType(EventObject.class);
	}
	@RequestMapping(method = RequestMethod.GET, value = "/pois")
	public @ResponseBody List<POIObject> getAllPOIs() throws DataException {
		return storage.getObjectsByType(POIObject.class);
	}
	@RequestMapping(method = RequestMethod.GET, value = "/contents")
	public @ResponseBody List<ContentObject> getAllContents() throws DataException {
		return storage.getObjectsByType(ContentObject.class);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/mainevents")
	public @ResponseBody List<MainEventObject> getAllMainEvents() throws DataException {
		return storage.getObjectsByType(MainEventObject.class);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/config")
	public @ResponseBody DynamicConfigObject getConfig() throws DataException {
		return storage.getObjectsByType(DynamicConfigObject.class).get(0);
	}	

	@RequestMapping(method = RequestMethod.GET, value = "/home")
	public @ResponseBody HomeObject getHome() throws DataException {
		return storage.getObjectsByType(HomeObject.class).get(0);
	}		
	
	@RequestMapping(method = RequestMethod.GET, value = "/restaurants")
	public @ResponseBody List<RestaurantObject> getAllRestaurants() throws DataException {
		return storage.getObjectsByType(RestaurantObject.class);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/hotels")
	public @ResponseBody List<HotelObject> getAllHotels() throws DataException {
		return storage.getObjectsByType(HotelObject.class);
	}	
	
	@RequestMapping(method = RequestMethod.GET, value = "/itineraries")
	public @ResponseBody List<ItineraryObject> getAllItineraries() throws DataException {
		return storage.getObjectsByType(ItineraryObject.class);
	}	
	
	@RequestMapping(method = RequestMethod.GET, value = "/testi")
	public @ResponseBody List<ContentObject> getAllITesti() throws DataException {
		return storage.getObjectsByType(ContentObject.class);
	}		
	

}
