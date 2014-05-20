package eu.trentorise.smartcampus.service.opendata;

import it.sayservice.platform.servicebus.test.DataFlowTestHelper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import junit.framework.TestCase;

import com.google.protobuf.Message;

import eu.trentorise.smartcampus.service.opendata.data.message.Opendata.Evento;
import eu.trentorise.smartcampus.service.opendata.impl.GetEventiDataFlow;

public class TestDataFlow extends TestCase {

	public void testRun() throws Exception {
		DataFlowTestHelper helper = new DataFlowTestHelper();
		Map<String, Object> parameters = new HashMap<String, Object>();

		Map<String, Object> out1 = helper.executeDataFlow("smartcampus.service.opendata", "GetEventi", new GetEventiDataFlow(), parameters);
		List<Message> data1 = (List<Message>)out1.get("data");
		for (Message msg: data1) {
			System.err.println(((Evento)msg).getCategory());
			System.err.println("-----------");
		}

	}
}
