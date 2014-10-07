package eu.trentorise.smartcampus.service.opendata;

import it.sayservice.platform.servicebus.test.DataFlowTestHelper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import junit.framework.TestCase;

import org.codehaus.jackson.map.ObjectMapper;

import com.google.protobuf.Message;

import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.ConfigData;
import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.Evento;
import eu.trentorise.smartcampus.service.opendata.impl.GetConfigDataFlow;
import eu.trentorise.smartcampus.service.opendata.impl.GetEventiDataFlow;

public class TestDataFlow extends TestCase {

	public void _testEvents() throws Exception {
		DataFlowTestHelper helper = new DataFlowTestHelper();
		Map<String, Object> parameters = new HashMap<String, Object>();		
		
		parameters.put("url", "http://www.comune.trento.it/api/opendata/v1/content/class/event/offset/0/limit/1000");

		Map<String, Object> out0 = helper.executeDataFlow("smartcampus.service.opendata", "GetEventi", new GetEventiDataFlow(), parameters);
		List<Message> data0 = (List<Message>)out0.get("data");
		for (Message msg: data0) {
			System.err.println(((Evento)msg).getLastModified()+" : "+((Evento)msg).getTitle());
			System.err.println("-----------");
		}
	}
	
	
	public void testData() throws Exception {
		DataFlowTestHelper helper = new DataFlowTestHelper();
		Map<String, Object> parameters = new HashMap<String, Object>();		
		
//		parameters.put("url", "http://www.comune.trento.it/api/opendata/v1/content/class/event/offset/0/limit/1000");
//
//		Map<String, Object> out0 = helper.executeDataFlow("smartcampus.service.opendata", "GetEventi", new GetEventiDataFlow(), parameters);
//		List<Message> data0 = (List<Message>)out0.get("data");
//		for (Message msg: data0) {
//			System.err.println(((Evento)msg).getLastModified()+" : "+((Evento)msg).getTitle());
//			System.err.println("-----------");
//		}
//		System.exit(0);
			
		
//		String s = "[{\"name\":\"Turista\",\"id\":\"774567\",\"uri\":\"http://trento.opencontent.it/comuneintasca/data/774567\"}]";
//		OpenContentScript osc = new OpenContentScript();
//		System.out.println(osc.extractUri(s));
//		System.exit(0);
		
//		String s = "{\\\"highlights\\\"}";
//		s = s.replace("\\\"", "\"");
//		System.out.println(s);
//		System.exit(0);
		
//		parameters.put("url", "http://trento.opencontent.it/api/opendata/v1/content/class/edificio_storico");  // edifici
		


//		parameters.put("url", "http://trento.opencontent.it/comuneintasca/data");
		parameters.put("url", "http://www.comune.trento.it/comuneintasca/data"); 
		Map<String, Object> out1 = helper.executeDataFlow("smartcampus.service.opendata", "GetConfig", new GetConfigDataFlow(), parameters);		
		
//		parameters.put("url", "http://trento.opencontent.it/api/opendata/v1/content/node/754329/list/limit/1000");
//		parameters.put("url", "http://www.comune.trento.it/api/opendata/v1/content/node/870375/list/limit/1000"); // prod
//		Map<String, Object> out1 = helper.executeDataFlow("smartcampus.service.opendata", "GetRestaurants", new GetRestaurantsDataFlow(), parameters);

//		parameters.put("url", "http://trento.opencontent.it/api/opendata/v1/content/node/754211/list/limit/1000");
//		parameters.put("url", "http://www.comune.trento.it/api/opendata/v1/content/node/870377/list/limit/1000"); // prod
//		Map<String, Object> out1 = helper.executeDataFlow("smartcampus.service.opendata", "GetHotels", new GetHotelsDataFlow(), parameters);
		
//		parameters.put("url", "http://trento.opencontent.it/api/opendata/v1/content/node/754058/list/limit/1000");  // cultura
//		parameters.put("url", "http://www.comune.trento.it/api/opendata/v1/content/node/870378/list/limit/1000"); // prod
//		Map<String, Object> out1 = helper.executeDataFlow("smartcampus.service.opendata", "GetCultura", new GetCulturaDataFlow(), parameters);		
		
//		parameters.put("url", "http://trento.opencontent.it/api/opendata/v1/content/node/754317/list/limit/1000");
//		parameters.put("url", "http://www.comune.trento.it/api/opendata/v1/content/node/870376/list/limit/1000"); // prod
//		Map<String, Object> out1 = helper.executeDataFlow("smartcampus.service.opendata", "GetMainEvents", new GetMainEventsDataFlow(), parameters);		
		
//		parameters.put("url", "http://trento.opencontent.it/api/opendata/v1/content/node/754015/list/limit/1000"); // ok
//		parameters.put("url", "http://www.comune.trento.it/api/opendata/v1/content/node/870379/list/limit/1000"); // prod
//		Map<String, Object> out1 = helper.executeDataFlow("smartcampus.service.opendata", "GetTesti", new GetTestiDataFlow(), parameters);			
		
//		parameters.put("url", "http://trento.opencontent.it/api/opendata/v1/content/node/754330/list/limit/1000");
//		parameters.put("url", "http://www.comune.trento.it/api/opendata/v1/content/node/870374/list/limit/1000"); // prod
//		Map<String, Object> out1 = helper.executeDataFlow("smartcampus.service.opendata", "GetItinerari", new GetItinerariDataFlow(), parameters);		
		
		ObjectMapper mapper = new ObjectMapper();		
		List<Message> data1 = (List<Message>)out1.get("data");
		System.out.println(data1.size());
		for (Message msg: data1) {
//			System.err.println(msg);
//			System.err.println(((I18nTesto)msg).getTitle().getIt());
			System.err.println(((ConfigData)msg).getData());
			
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
	
//	parameters.put("url", "http://trento.opencontent.it/api/opendata/v1/content/node/754009/list/limit/1000"); // testi ko
	
}
