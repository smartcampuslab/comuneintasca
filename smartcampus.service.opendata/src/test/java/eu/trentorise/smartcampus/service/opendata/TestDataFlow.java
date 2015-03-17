package eu.trentorise.smartcampus.service.opendata;

import it.sayservice.platform.servicebus.test.DataFlowTestHelper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import junit.framework.TestCase;

import com.google.protobuf.Message;

import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.ConfigData;
import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.Evento;
import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.I18nCultura;
import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.I18nHotel;
import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.I18nItinerario;
import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.I18nMainEvent;
import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.I18nRestaurant;
import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.I18nTesto;
import eu.trentorise.smartcampus.service.opendata.impl.GetConfigDataFlow;
import eu.trentorise.smartcampus.service.opendata.impl.GetCulturaDataFlow;
import eu.trentorise.smartcampus.service.opendata.impl.GetEventiParamDataFlow;
import eu.trentorise.smartcampus.service.opendata.impl.GetHotelsDataFlow;
import eu.trentorise.smartcampus.service.opendata.impl.GetItinerariDataFlow;
import eu.trentorise.smartcampus.service.opendata.impl.GetMainEventsDataFlow;
import eu.trentorise.smartcampus.service.opendata.impl.GetRestaurantsDataFlow;
import eu.trentorise.smartcampus.service.opendata.impl.GetTerritoryServicesDataFlow;
import eu.trentorise.smartcampus.service.opendata.impl.GetTestiDataFlow;

public class TestDataFlow extends TestCase {

	public void _testEvents() throws Exception {
		DataFlowTestHelper helper = new DataFlowTestHelper("test");
		Map<String, Object> parameters = new HashMap<String, Object>();		
		
		parameters.put("url", "http://www.comune.trento.it/api/opendata/v1/content/class/event/offset/0/limit/1000");

		Map<String, Object> out0 = helper.executeDataFlow("smartcampus.service.opendata", "GetEventiParam", new GetEventiParamDataFlow(), parameters);
		List<Message> data0 = (List<Message>)out0.get("data");
		for (Message msg: data0) {
			System.err.println(((Evento)msg).getTitle()+":"+((Evento)msg).getSubtitle());
			System.err.println("-----------");
		}
	}
	
	
	public void _testData() throws Exception {
		DataFlowTestHelper helper = new DataFlowTestHelper("test");
		Map<String, Object> parameters = new HashMap<String, Object>();		
		
//		parameters.put("url", "http://trento.opencontent.it/comuneintasca/data");
//		parameters.put("url", "http://www.comune.trento.it/comuneintasca/data"); 
//		Map<String, Object> out1 = helper.executeDataFlow("smartcampus.service.opendata", "GetConfig", new GetConfigDataFlow(), parameters);		
		
//		parameters.put("url", "http://trento.opencontent.it/api/opendata/v1/content/node/754329/list/limit/1000");
//		parameters.put("url", "http://ricadi.opencontent.it/api/opendata/v1/content/class/ristorante/offset/0/limit/1000"); // prod
//		Map<String, Object> out1 = helper.executeDataFlow("smartcampus.service.opendata", "GetRestaurants", new GetRestaurantsDataFlow(), parameters);

//		parameters.put("url", "http://trento.opencontent.it/api/opendata/v1/content/node/754329/list/limit/1000");
//		parameters.put("url", "http://ricadi.opencontent.it/api/opendata/v1/content/class/servizio_sul_territorio/offset/0/limit/1000"); // prod
//		Map<String, Object> out1 = helper.executeDataFlow("smartcampus.service.opendata", "GetTerritoryServices", new GetTerritoryServicesDataFlow(), parameters);

//		parameters.put("url", "http://trento.opencontent.it/api/opendata/v1/content/node/754211/list/limit/1000");
//		parameters.put("url", "http://www.comune.trento.it/api/opendata/v1/content/node/870377/list/limit/1000"); // prod
//		Map<String, Object> out1 = helper.executeDataFlow("smartcampus.service.opendata", "GetHotels", new GetHotelsDataFlow(), parameters);
		
//		parameters.put("url", "http://trento.opencontent.it/api/opendata/v1/content/node/754058/list/limit/1000");  // cultura
//		parameters.put("url", "http://ricadi.opencontent.it/api/opendata/v1/content/class/luogo/offset/0/limit/1000"); // prod
//		Map<String, Object> out1 = helper.executeDataFlow("smartcampus.service.opendata", "GetCultura", new GetCulturaDataFlow(), parameters);		
//		
//		parameters.put("url", "http://trento.opencontent.it/api/opendata/v1/content/node/754317/list/limit/1000");
		parameters.put("url", "http://www.comune.trento.it/api/opendata/v1/content/class/iniziativa/offset/0/limit/1000"); // prod
		Map<String, Object> out1 = helper.executeDataFlow("smartcampus.service.opendata", "GetMainEvents", new GetMainEventsDataFlow(), parameters);		
//		
//		parameters.put("url", "http://trento.opencontent.it/api/opendata/v1/content/node/754015/list/limit/1000"); // ok
//		parameters.put("url", "http://www.comune.trento.it/api/opendata/v1/content/class/folder/offset/0/limit/100"); // prod
//		Map<String, Object> out1 = helper.executeDataFlow("smartcampus.service.opendata", "GetTesti", new GetTestiDataFlow(), parameters);			
		
//		parameters.put("url", "http://trento.opencontent.it/api/opendata/v1/content/node/754330/list/limit/1000");
//		parameters.put("url", "http://www.comune.trento.it/api/opendata/v1/content/node/870374/list/limit/1000"); // prod
//		Map<String, Object> out1 = helper.executeDataFlow("smartcampus.service.opendata", "GetItinerari", new GetItinerariDataFlow(), parameters);		
		
//		ObjectMapper mapper = new ObjectMapper();		
		List<Message> data1 = (List<Message>)out1.get("data");
		System.out.println(data1.size());
		for (Message msg: data1) {
			System.err.println(((I18nMainEvent)msg).getClassification().getIt());
			System.err.println(((I18nMainEvent)msg).getTitle().getIt()+":"+((I18nMainEvent)msg).getSubtitle().getIt());
			System.err.println(((I18nMainEvent)msg).getDescription().getIt());
			System.err.println("-----------");
//			System.err.println(((I18nCultura)msg).getClassification().getIt()+" : "+((I18nCultura)msg).getTitle().getIt()+":"+((I18nCultura)msg).getId()+":"+":"+((I18nCultura)msg).getLastModified());
//			System.err.println(msg);
//			System.err.println(((I18nTesto)msg).getTitle().getIt());
//			System.err.println(((ConfigData)msg).getData());
//			System.err.println(((I18nCultura)msg).getClassification().getIt()+" : "+((I18nCultura)msg).getTitle().getIt()+":"+((I18nCultura)msg).getId()+":"+":"+((I18nCultura)msg).getLastModified());
			
//			ConfigData cd = (ConfigData)msg;
//			System.out.println(cd.getData());
//			String d = cd.getData().replace("\\\"", "");
//			try {
//			ConfigObject config = mapper.readValue(d, ConfigObject.class);
//			} catch (Exception e) {
//				e.printStackTrace();
//			}
			
			
			System.err.println("-----------");
		}		
		
	}

	public void testItinerari() throws Exception {
		DataFlowTestHelper helper = new DataFlowTestHelper("test");
		Map<String, Object> parameters = new HashMap<String, Object>();		
		
//		parameters.put("url", "http://trento.opencontent.it/api/opendata/v1/content/node/754330/list/limit/1000");
		parameters.put("url", "http://www.comune.trento.it/api/opendata/v1/content/class/itinerario/offset/0/limit/1000"); // prod
		Map<String, Object> out1 = helper.executeDataFlow("smartcampus.service.opendata", "GetItinerari", new GetItinerariDataFlow(), parameters);		

		List<Message> data1 = (List<Message>)out1.get("data");
		System.out.println(data1.size());
		for (Message msg: data1) {
//			System.err.println(((I18nItinerario)msg).getTitle().getIt()+":"+((I18nItinerario)msg).getSubtitle().getIt());
			System.err.println(((I18nItinerario)msg).getDescription().getIt());
			System.err.println("-----------");
		}		
		
	}

	public void testTesti() throws Exception {
		DataFlowTestHelper helper = new DataFlowTestHelper("test");
		Map<String, Object> parameters = new HashMap<String, Object>();		
		
//		parameters.put("url", "http://trento.opencontent.it/api/opendata/v1/content/node/754015/list/limit/1000"); // ok
		parameters.put("url", "http://www.comune.trento.it/api/opendata/v1/content/class/folder/offset/0/limit/10000"); // prod
		Map<String, Object> out1 = helper.executeDataFlow("smartcampus.service.opendata", "GetTesti", new GetTestiDataFlow(), parameters);			

		List<Message> data1 = (List<Message>)out1.get("data");
		System.out.println(data1.size());
		for (Message msg: data1) {
//			System.err.println(((I18nTesto)msg).getTitle().getIt()+":"+((I18nTesto)msg).getSubtitle().getIt());
			System.err.println(((I18nTesto)msg).getDescription().getIt());
			System.err.println("-----------");
		}		
		
	}

	public void testMainEvents() throws Exception {
		DataFlowTestHelper helper = new DataFlowTestHelper("test");
		Map<String, Object> parameters = new HashMap<String, Object>();		
		
//		parameters.put("url", "http://trento.opencontent.it/api/opendata/v1/content/node/754317/list/limit/1000");
		parameters.put("url", "http://www.comune.trento.it/api/opendata/v1/content/class/iniziativa/offset/0/limit/1000"); // prod
		Map<String, Object> out1 = helper.executeDataFlow("smartcampus.service.opendata", "GetMainEvents", new GetMainEventsDataFlow(), parameters);		
//		
		List<Message> data1 = (List<Message>)out1.get("data");
		System.out.println(data1.size());
		for (Message msg: data1) {
//			System.err.println(((I18nMainEvent)msg).getTitle().getIt()+":"+((I18nMainEvent)msg).getSubtitle().getIt());
			System.err.println(((I18nMainEvent)msg).getDescription().getIt());
			System.err.println("-----------");
		}		
		
	}

	public void testPOIs() throws Exception {
		DataFlowTestHelper helper = new DataFlowTestHelper("test");
		Map<String, Object> parameters = new HashMap<String, Object>();		
		
		parameters.put("url", "http://www.comune.trento.it/api/opendata/v1/content/class/luogo/offset/0/limit/1000");  // cultura
//		parameters.put("url", "http://ricadi.opencontent.it/api/opendata/v1/content/class/luogo/offset/0/limit/1000"); // prod
		Map<String, Object> out1 = helper.executeDataFlow("smartcampus.service.opendata", "GetCultura", new GetCulturaDataFlow(), parameters);		
//		
		List<Message> data1 = (List<Message>)out1.get("data");
		System.out.println(data1.size());
		for (Message msg: data1) {
//			System.err.println(((I18nCultura)msg).getTitle().getIt()+":"+((I18nCultura)msg).getSubtitle().getIt());
			System.err.println(((I18nCultura)msg).getDescription().getIt());
			System.err.println("-----------");
		}		
		
	}

	public void testHotels() throws Exception {
		DataFlowTestHelper helper = new DataFlowTestHelper("test");
		Map<String, Object> parameters = new HashMap<String, Object>();		

//		parameters.put("url", "http://trento.opencontent.it/api/opendata/v1/content/node/754211/list/limit/1000");
		parameters.put("url", "http://www.comune.trento.it/api/opendata/v1/content/class/accomodation/offset/0/limit/1000"); // prod
		Map<String, Object> out1 = helper.executeDataFlow("smartcampus.service.opendata", "GetHotels", new GetHotelsDataFlow(), parameters);
		

		List<Message> data1 = (List<Message>)out1.get("data");
		System.out.println(data1.size());
		for (Message msg: data1) {
			System.err.println(((I18nHotel)msg).getClassification().getIt());
			System.err.println(((I18nHotel)msg).getTitle().getIt()+":"+((I18nHotel)msg).getSubtitle().getIt());
			System.err.println(((I18nHotel)msg).getDescription().getIt());
			System.err.println("-----------");
		}		
		
	}

	public void testTerritoryServices() throws Exception {
		DataFlowTestHelper helper = new DataFlowTestHelper("test");
		Map<String, Object> parameters = new HashMap<String, Object>();		
		

//		parameters.put("url", "http://trento.opencontent.it/api/opendata/v1/content/node/754329/list/limit/1000");
		parameters.put("url", "http://ricadi.opencontent.it/api/opendata/v1/content/class/servizio_sul_territorio/offset/0/limit/1000"); // prod
		Map<String, Object> out1 = helper.executeDataFlow("smartcampus.service.opendata", "GetTerritoryServices", new GetTerritoryServicesDataFlow(), parameters);

		List<Message> data1 = (List<Message>)out1.get("data");
		System.out.println(data1.size());
		for (Message msg: data1) {
			System.err.println(((I18nCultura)msg).getClassification().getIt());
			System.err.println(((I18nCultura)msg).getTitle().getIt()+":"+((I18nCultura)msg).getSubtitle().getIt());
			System.err.println(((I18nCultura)msg).getDescription().getIt());
			System.err.println("-----------");
		}		
		
	}

	public void testRestaurants() throws Exception {
		DataFlowTestHelper helper = new DataFlowTestHelper("test");
		Map<String, Object> parameters = new HashMap<String, Object>();		
		
		
		parameters.put("url", "http://www.comune.trento.it/api/opendata/v1/content/class/ristorante/offset/0/limit/1000");
//		parameters.put("url", "http://ricadi.opencontent.it/api/opendata/v1/content/class/ristorante/offset/0/limit/1000"); // prod
		Map<String, Object> out1 = helper.executeDataFlow("smartcampus.service.opendata", "GetRestaurants", new GetRestaurantsDataFlow(), parameters);

		List<Message> data1 = (List<Message>)out1.get("data");
		System.out.println(data1.size());
		for (Message msg: data1) {
			System.err.println(((I18nRestaurant)msg).getClassification().getIt());
			System.err.println(((I18nRestaurant)msg).getTitle().getIt()+":"+((I18nRestaurant)msg).getSubtitle().getIt());
			System.err.println(((I18nRestaurant)msg).getDescription().getIt());
			System.err.println("-----------");
		}		
		
	}

	public void testConfig() throws Exception {
		DataFlowTestHelper helper = new DataFlowTestHelper("test");
		Map<String, Object> parameters = new HashMap<String, Object>();		
		
//		parameters.put("url", "http://trento.opencontent.it/comuneintasca/data");
		parameters.put("url", "http://www.comune.trento.it/comuneintasca/data"); 
		Map<String, Object> out1 = helper.executeDataFlow("smartcampus.service.opendata", "GetConfig", new GetConfigDataFlow(), parameters);		
		
		
		List<Message> data1 = (List<Message>)out1.get("data");
		System.out.println(data1.size());
		for (Message msg: data1) {
			ConfigData cd = (ConfigData)msg;
			System.out.println(cd.getData());
			System.err.println("-----------");
		}		
		
	}

}
