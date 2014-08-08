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
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.map.ObjectMapper;

import com.google.protobuf.Message;

import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.I18nCultura;
import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.I18nHotel;
import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.I18nItinerario;
import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.I18nString;

public class ItineraryScript extends OpenContentScript {

	public Message extractData(String itJson, String enJson, String deJson) throws Exception {
		Map<String, Map<String, Object>> i18n = buildMap(langs, itJson, enJson, deJson);
		I18nItinerario.Builder builder = I18nItinerario.newBuilder();

		builder.setId(((String)getRecValue(getMap(i18n,DEFAULT_LANGUAGE), "metadata", "objectRemoteId")));

		builder.setLastModified(((BigInteger)getRecValue(getMap(i18n,DEFAULT_LANGUAGE), "metadata", "dateModified")).longValue() * 1000);

		Object url = getRecValue(getMap(i18n,DEFAULT_LANGUAGE), FIELDS, "url", STRING_VALUE);
		if (url != null && url instanceof String) {
			builder.setUrl((String)url);
		}
		
		builder.setTitle(getI18NStringValue(i18n, FIELDS, "titolo", VALUE));
		
		builder.setDescription(getI18NStringValue(i18n, FIELDS, "descrizione", VALUE));

		builder.setSubtitle(getI18NStringValue(i18n, FIELDS, "sottotitolo", VALUE));
		
		builder.setInfo(getI18NStringValue(i18n, FIELDS, "info", VALUE));
		
		List<String> steps = (List<String>)getRecValue(getMap(i18n,DEFAULT_LANGUAGE), FIELDS, "steps", VALUE, OBJECT_NAME);
		builder.addAllSteps(steps);

		Object image = getRecValue(getMap(i18n,DEFAULT_LANGUAGE), FIELDS, "image", STRING_VALUE);
		if (image != null && image instanceof String) {
			builder.setImage((String)image);
		}
		
		Object length = getRecValue(getMap(i18n,DEFAULT_LANGUAGE), FIELDS, "lunghezza", VALUE);
		if (length != null && length instanceof String) {
			builder.setLength(Integer.parseInt((String)length));
		}
		
		Object duration = getRecValue(getMap(i18n,DEFAULT_LANGUAGE), FIELDS, "durata", VALUE);
		if (duration != null && duration instanceof String) {
			builder.setDuration(Integer.parseInt((String)duration));
		}		
		
		builder.setDifficulty(getI18NStringValue(i18n, FIELDS, "difficolta", STRING_VALUE));


		

		return builder.build();
	}
	
}
