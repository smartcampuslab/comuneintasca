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
package eu.trentorise.smartcampus.service.opendata.scripts;

import java.math.BigInteger;
import java.util.Map;

import com.google.protobuf.Message;

import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.I18nRestaurant;
import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.I18nString;

public class RestaurantsScript extends OpenContentScript {

	public Message extractData(String itJson, String enJson, String deJson) throws Exception {
		Map<String, Map<String, Object>> i18n = buildMap(langs, itJson, enJson, deJson);
		I18nRestaurant.Builder builder = I18nRestaurant.newBuilder();

		builder.setId(((String)getRecValue(getMap(i18n,DEFAULT_LANGUAGE), "metadata", "objectRemoteId")));
		builder.setObjectId(getRecValue(getMap(i18n,DEFAULT_LANGUAGE), "metadata", "objectId").toString());
		
		builder.setLastModified(((BigInteger)getRecValue(getMap(i18n,DEFAULT_LANGUAGE), "metadata", "dateModified")).longValue() * 1000);
		
		Object url = getRecValue(getMap(i18n,DEFAULT_LANGUAGE), FIELDS, "url", STRING_VALUE);
		if (url != null && url instanceof String) {
			builder.setUrl((String)url);
		}	

		builder.setTitle(getI18NStringValue(i18n, FIELDS, "titolo", VALUE));

		// RestaurantObject -> classification, info
		
//		I18nString cat = getI18NStringValue(i18n, FIELDS, "tipo_locale", STRING_VALUE);
		I18nString cat = getI18NStringValue(i18n, FIELDS, "tipo_locale", VALUE, OBJECT_NAME);
		if (cat.hasIt()) {
			builder.setClassification(cat);
		}

		builder.setSubtitle(getI18NStringValue(i18n, FIELDS, "abstract", VALUE));
		builder.setDescription(getI18NStringValue(i18n, FIELDS, "descrizione", VALUE));
		if (!builder.getDescription().hasIt()) {
			builder.setDescription(getI18NStringValue(i18n, FIELDS, "description", VALUE));
		}

		builder.setAddress(getI18NStringValue(i18n, FIELDS, "indirizzo", VALUE));
		
		Object gps = getRecValue(getMap(i18n,DEFAULT_LANGUAGE), FIELDS, "gps", STRING_VALUE);
		if (gps != null && gps instanceof String) {
			Double latlon[] = extractGPS((String)gps);
			if (latlon != null) {
				builder.setLat(latlon[0]);
				builder.setLon(latlon[1]);
			}
		}
		

		Object image = getRecValue(getMap(i18n,DEFAULT_LANGUAGE), FIELDS, "image", STRING_VALUE);
		if (image != null && image instanceof String) {
			builder.setImage((String)image);
		}
		
		Object phone1 = getRecValue(getMap(i18n,DEFAULT_LANGUAGE), FIELDS, "telefono", STRING_VALUE);
		if (phone1 != null && phone1 instanceof String) {
			builder.setPhone((String)phone1);
		}
		Object fax = getRecValue(getMap(i18n,DEFAULT_LANGUAGE), FIELDS, "fax", STRING_VALUE);
		if (fax != null && fax instanceof String) {
			builder.setFax((String)fax);
		}		
		Object email = getRecValue(getMap(i18n,DEFAULT_LANGUAGE), FIELDS, "email", STRING_VALUE);
		if (email != null && email instanceof String) {
			builder.setEmail((String)email);
		}		
		
		builder.setTimetable(getI18NStringValue(i18n, FIELDS, "orario", VALUE));
		
		I18nString value = getI18NStringValue(i18n, FIELDS, "riposo", "value");
		builder.setClosing(value);
		
		value = getI18NStringValue(i18n, FIELDS, "prezzo_medio_in_euro", "value");
		
		builder.setPrices(value);
		
		I18nString equip = getI18NStringValue(i18n, FIELDS, "servizi_offerti", VALUE, OBJECT_NAME);
		builder.setEquipment(equip);
		
		I18nString info = getI18NStringValue(i18n, FIELDS, "info", VALUE);
		if (info.hasIt()) {
			builder.setInfo(info);
		}		

		return builder.build();
	}
	
}
