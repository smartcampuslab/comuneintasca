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

import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.I18nString;
import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.I18nTesto;

public class TestiScript extends OpenContentScript {

	public Message extractData(String itJson, String enJson, String deJson) throws Exception {
		Map<String, Map<String, Object>> i18n = buildMap(langs, itJson, enJson, deJson);
		I18nTesto.Builder builder = I18nTesto.newBuilder();

		builder.setId(((String)getRecValue(getMap(i18n,DEFAULT_LANGUAGE), "metadata", "objectRemoteId")));
		builder.setObjectId(getRecValue(getMap(i18n,DEFAULT_LANGUAGE), "metadata", "objectId").toString());
		
		builder.setLastModified(((BigInteger)getRecValue(getMap(i18n,DEFAULT_LANGUAGE), "metadata", "dateModified")).longValue() * 1000);

		Object url = getRecValue(getMap(i18n,DEFAULT_LANGUAGE), FIELDS, "url", STRING_VALUE);
		if (url != null && url instanceof String) {
			builder.setUrl((String)url);
		}
		
		builder.setTitle(getI18NStringValue(i18n, FIELDS, "name", VALUE));
		
		builder.setClassification(getI18NStringValue(i18n, FIELDS, "classifications", VALUE));
		
		builder.setDescription(getI18NStringValue(i18n, FIELDS, "description", VALUE));

		builder.setSubtitle(getI18NStringValue(i18n, FIELDS, "abstract", VALUE));
		
		builder.setAddress(getI18NStringValue(i18n, FIELDS, "indirizzo", VALUE));

		Object image = getRecValue(getMap(i18n,DEFAULT_LANGUAGE), FIELDS, "image", STRING_VALUE);
		if (image != null && image instanceof String) {
			builder.setImage((String)image);
		}
		
		I18nString info = getI18NStringValue(i18n, FIELDS, "info", VALUE);
		if (info.hasIt()) {
			builder.setInfo(info);
		}			

		return builder.build();
	}
	
}
