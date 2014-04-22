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

import eu.trentorise.smartcampus.comuneintasca.model.ContentObject;
import eu.trentorise.smartcampus.comuneintasca.model.EventObject;
import eu.trentorise.smartcampus.comuneintasca.model.POIObject;
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

}
