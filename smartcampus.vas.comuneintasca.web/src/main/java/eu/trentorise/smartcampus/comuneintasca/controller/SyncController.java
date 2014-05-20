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

import java.util.Calendar;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import eu.trentorise.smartcampus.comuneintasca.model.EventObject;
import eu.trentorise.smartcampus.presentation.common.util.Util;
import eu.trentorise.smartcampus.presentation.data.BasicObject;
import eu.trentorise.smartcampus.presentation.data.SyncData;
import eu.trentorise.smartcampus.presentation.data.SyncDataRequest;

@Controller
public class SyncController extends AbstractObjectController {

	@RequestMapping(method = RequestMethod.POST, value = "/sync")
	public ResponseEntity<SyncData> synchronize(HttpServletRequest request, @RequestParam long since, @RequestBody Map<String,Object> obj) throws Exception{
		try {
			SyncDataRequest syncReq = Util.convertRequest(obj, since);
			storage.cleanSyncData(syncReq.getSyncData(), null);
			SyncData result = storage.getSyncData(syncReq.getSince(), null, syncReq.getSyncData().getInclude(), syncReq.getSyncData().getExclude());
			cleanResult(result);
			return new ResponseEntity<SyncData>(result,HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}

	private void cleanResult(SyncData result) {
		List<BasicObject> list = result.getUpdated().get(EventObject.class.getName());
		Calendar ref = Calendar.getInstance();
		ref.set(Calendar.HOUR_OF_DAY, 0);
		ref.set(Calendar.MINUTE, 0);
		if (list != null) {
			for (Iterator<BasicObject> iterator = list.iterator(); iterator.hasNext();) {
				EventObject event = (EventObject) iterator.next();
				if (event.getToTime() > 0 && event.getToTime() < ref.getTimeInMillis() ||
					event.getToTime() == 0 && event.getFromTime() < ref.getTimeInMillis()) {
					iterator.remove();
				}
				
			}
		}
		result.getUpdated().put(EventObject.class.getName(), list);
	}

}
