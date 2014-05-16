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
package eu.trentorise.smartcampus.service.festivaleconomia.scripts;

import it.sayservice.platform.core.bus.common.exception.ConnectorException;
import it.sayservice.platform.core.bus.common.exception.DataFlowException;
import it.sayservice.platform.core.bus.common.exception.TransformerException;
import it.sayservice.platform.core.bus.service.connector.HTTPConnector;
import it.sayservice.platform.core.bus.service.transformer.ReaderToStringTransformer;

import java.io.Reader;
import java.io.StringReader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.codehaus.jackson.map.ObjectMapper;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import com.google.protobuf.Message;

import eu.trentorise.smartcampus.service.festivaleconomia.data.message.Festivaleconomia.Evento;
import eu.trentorise.smartcampus.service.festivaleconomia.data.message.Festivaleconomia.Trans;

public class DataScript {

	private static final String IMG_PRE = "http://2014.festivaleconomia.eu";
	private static final String URL_PRE = "http://2014.festivaleconomia.eu/-/";
	private static ObjectMapper mapper = new ObjectMapper();
	private static SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
	private static SimpleDateFormat sdfShort = new SimpleDateFormat("HH:mm");

	private static Map<String,Map<String,String>> categories = new HashMap<String, Map<String,String>>();
	static {
		HashMap<String, String> catConf = new HashMap<String, String>();
		catConf.put("it", "Conferenza");
		catConf.put("en", "Conference");
		categories.put("11515", catConf);
		HashMap<String, String> catEvent = new HashMap<String, String>();
		catEvent.put("it", "Evento");
		catEvent.put("en", "Event");
		categories.put("11677", catEvent);
		HashMap<String, String> catOther = new HashMap<String, String>();
		catOther.put("it", "Altro evento");
		catOther.put("en", "Other Event");
		categories.put("395163", catOther);
	}
	
	public List<Message> extractEvents() throws Exception {
		List<Message> results = new ArrayList<Message>();
		
		String confEvents = get("http://2014.festivaleconomia.eu/api/jsonws/assetentry/get-entries?%2BentryQuery=com.liferay.portlet.asset.service.persistence.AssetEntryQuery&entryQuery.classNameIds=10108&entryQuery.allCategoryIds=11515");
		String baseEvents = get("http://2014.festivaleconomia.eu/api/jsonws/assetentry/get-entries?%2BentryQuery=com.liferay.portlet.asset.service.persistence.AssetEntryQuery&entryQuery.classNameIds=10108&entryQuery.allCategoryIds=11677");
//		String otherEvents = get("http://2014.festivaleconomia.eu/api/jsonws/assetentry/get-entries?%2BentryQuery=com.liferay.portlet.asset.service.persistence.AssetEntryQuery&entryQuery.classNameIds=10108&entryQuery.allCategoryIds=395163");
		extractEventsByType(results, confEvents, "11515");
		extractEventsByType(results, baseEvents, "11677");
//		extractEventsByType(results, otherEvents, "395163");
		return results;
	}

	private void extractEventsByType(List<Message> results, String events, String type) throws Exception,
			ConnectorException, TransformerException {
		Map<String,String> map = extractIds(events);
		
		Map<String, PlaceData> places = new HashMap<String, DataScript.PlaceData>();
		for (String pk : map.keySet()) {
			String entryId = map.get(pk);
			String placeList = get("http://2014.festivaleconomia.eu/api/jsonws/assetentry/get-entries?%2BentryQuery=com.liferay.portlet.asset.service.persistence.AssetEntryQuery&entryQuery.classNameIds=10108&entryQuery.allCategoryIds=11678&entryQuery.linkedAssetEntryId="+entryId);
			Map<String,String> eventPlaceIds = extractIds(placeList);
			String eventString = get("http://2014.festivaleconomia.eu/api/jsonws/journalarticle/get-latest-article?resourcePrimKey="+pk);
			
			List<PlaceData> eventPlaces = new ArrayList<DataScript.PlaceData>();
			
			for (String ppk : eventPlaceIds.keySet()) {
				if (!places.containsKey(ppk)) {
					String placeString = get("http://2014.festivaleconomia.eu/api/jsonws/journalarticle/get-latest-article?resourcePrimKey="+ppk);
					PlaceData pd = extractPlace(placeString);
					places.put(ppk, pd);
				}
				eventPlaces.add(places.get(ppk));
			}
			Message event = buildEvent(pk, eventString, eventPlaces, type);
			if (event != null) {
				results.add(event);
			}
		}
	}
	
	@SuppressWarnings("unchecked")
	private Message buildEvent(String id, String eventString, List<PlaceData> eventPlaces, String type) throws Exception {
		Map<String, Object> map = mapper.readValue(eventString, Map.class);
		Map<String,String> titles = extractTitle((String)map.get("title"));
		if (titles == null) {
			System.err.println("Warning: missing data for id "+id);
			return null;
		}
		Map<String,Map<String,String>> data = extractContent((String)map.get("content"));

		
		Evento.Builder builder = Evento.newBuilder();
		builder.setId("ymir_"+id);
		builder.setLastModified((Long)map.get("modifiedDate"));
		builder.addAllCategory(extractCategories(type));
		builder.setUrl(URL_PRE+map.get("urlTitle")); 
		List<Trans> trans = new ArrayList<Trans>();
		for (String lang : titles.keySet()) {
			trans.add(Trans.newBuilder().setLang(lang).setValue(titles.get(lang)).build());
		}
		builder.addAllTitle(trans);
		
		trans = new ArrayList<Trans>();
		for (String lang : data.get("summary").keySet()) {
			trans.add(Trans.newBuilder().setLang(lang).setValue(data.get("summary").get(lang)).build());
		}
		builder.addAllDescription(trans);
		
		if (eventPlaces == null || eventPlaces.size() != 1) {
			throw new DataFlowException("Incorrect place data for event "+titles);
		}

		trans = new ArrayList<Trans>();
		Map<String, String> normAddr = eventPlaces.get(0).normalizedAddress();
		for (String lang : normAddr.keySet()) {
			trans.add(Trans.newBuilder().setLang(lang).setValue(normAddr.get(lang)).build());
		}
		builder.addAllAddress(trans);
		String date = getOrdinalValue(data.get("date"));
		
		String fromDate = getOrdinalValue(data.get("dateStart"));
		String toDate = getOrdinalValue(data.get("dateEnd"));
		if (fromDate != null) {
			builder.setFromTime(sdf.parse(fromDate).getTime());
		} else {
			builder.setFromTime(sdf.parse(date).getTime());
		}
		if (toDate != null) {
			try {
				builder.setToTime(sdf.parse(toDate).getTime());
			} catch (Exception e) {
				Calendar c = Calendar.getInstance();
				c.setTime(sdfShort.parse(toDate));
				Calendar c2 = Calendar.getInstance();
				c2.setTimeInMillis(builder.getFromTime());
				c2.set(Calendar.HOUR_OF_DAY, c.get(Calendar.HOUR_OF_DAY));
				c2.set(Calendar.MINUTE, c.get(Calendar.MINUTE));
				builder.setToTime(c2.getTimeInMillis());
			}
		} else {
			builder.setToTime(builder.getFromTime());
		}
		builder.setImage(IMG_PRE+ eventPlaces.get(0).image);
		return builder.build();
	}

	private List<Trans> extractCategories(String type) {
		Map<String, String> cats = categories.get(type);
		List<Trans> res = new ArrayList<Trans>();
		for (String key : cats.keySet()) {
			res.add(Trans.newBuilder().setLang(key).setValue(cats.get(key)).build());
		}
		return res;
	}

	@SuppressWarnings("unchecked")
	private PlaceData extractPlace(String placeString) throws Exception {
		Map<String, Object> map = mapper.readValue(placeString, Map.class);
		Map<String,String> titles = extractTitle((String)map.get("title"));
		Map<String,Map<String,String>> data = extractContent((String)map.get("content"));
		PlaceData pd = new PlaceData();
		pd.title = titles;
		pd.addressData = data.get("address");
		String lat = getOrdinalValue(data.get("latitude"));
		String lng = getOrdinalValue(data.get("longitude"));
		String image = getOrdinalValue(data.get("photo"));
		pd.image = image;
		if (lat != null && lng != null) {
			try {
				pd.location = new double[]{Double.parseDouble(lat), Double.parseDouble(lng)};
			} catch (Exception e) {
			}
		}
		return pd;
	}

	private String getOrdinalValue(Map<String, String> map) {
		if (map != null && ! map.isEmpty()) {
			return map.values().iterator().next();
		}
		return null;
	}

	private Map<String, Map<String, String>> extractContent(String string) throws Exception {
		return readXml(string);
	}

	private Map<String, String> extractTitle(String string) throws Exception {
		if (string != null) {
			 Map<String, Map<String,String>> map = readXml(string);
			 return map.get("title");
		} else {
			return null;
		}
	}
	
	private Map<String, Map<String,String>> readXml(String s) throws Exception {
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
	    DocumentBuilder builder = factory.newDocumentBuilder();
	    InputSource is = new InputSource(new StringReader(s));
	    Document d = builder.parse(is);
	    Element root = d.getDocumentElement();
	    NodeList nl = root.getChildNodes();
	    
	    Map<String, Map<String,String>> res = new HashMap<String, Map<String,String>>();
	    for (int i = 0; i < nl.getLength(); i++) {
	    	Node n = nl.item(i);
	    	if (! (n instanceof Element)) continue;
	    	
	    	Element e = (Element)n;
	    	String tag = e.getTagName();
	    	if (tag.equals("Title")) {
	    		String lang = e.getAttribute("language-id");
	    		String value = e.getTextContent().trim();
	    		if (!res.containsKey("title")) {
	    			res.put("title", new HashMap<String, String>());
	    		}
	    		res.get("title").put(mapLanguage(lang), value);
	    	} else if (tag.equals("dynamic-element")) {
	    		String key = e.getAttribute("name");
	    		Map<String,String> values = new HashMap<String, String>();
	    		NodeList contentNodeList = e.getChildNodes();
	    	    for (int j = 0; j < contentNodeList.getLength(); j++) {
	    	    	if (!(contentNodeList.item(j) instanceof Element)) continue;
	    	    	Element contentElement = (Element) contentNodeList.item(j);
	    	    	String lang = contentElement.getAttribute("language-id");
	    	    	if (lang == null) lang = "";
	    	    	values.put(lang, contentElement.getTextContent());
	    	    }
	    		res.put(key, values);
	    	}
	    } 
	    
	    return res;
	} 

	private String mapLanguage(String lang) {
		return lang.substring(0, lang.indexOf('_'));
	}

	@SuppressWarnings({ "unchecked"})
	private Map<String,String> extractIds(String ... events) throws Exception {
		Map<String,String> ids = new HashMap<String, String>();
		for (String json : events) {
			List<Map<String,Object>> list = mapper.readValue(json, List.class);
			for (Map<String,Object> asset : list) {
				Object pk = asset.get("classPK");
				if (pk == null) throw new DataFlowException("No PK found");
				ids.put(""+pk,""+asset.get("entryId"));
			}
		}
		return ids;
	}
	
	private String get(String url) throws ConnectorException, TransformerException {
		HTTPConnector c = new HTTPConnector();
		c.setEncoding("UTF-8");
		c.setUrl(url);
		Reader r = c.run();
		ReaderToStringTransformer r2s = new ReaderToStringTransformer();
		return r2s.transform(r);
	}

	private class PlaceData {
		Map<String, String> addressData;
		Map<String, String> title;
		String image;
		double[] location;
		
		Map<String,String> normalizedAddress() {
			Map<String, String> norm = new HashMap<String, String>();
			for (String s : addressData.keySet()) {
				
				String lang = s;
				if (s.isEmpty()) {
					lang = "it";
				}
				String titleString = title.get(lang);
				if (titleString == null) titleString = title.get("");
				String addr = addressData.get(s);
				if (titleString != null) {
					addr = titleString + " - "+addr;
				}
				norm.put(lang, addr);
			}
					
			return norm;
		}
	}
	
	public static void main(String[] args) throws Exception {
		new DataScript().extractEvents();
	}
}
