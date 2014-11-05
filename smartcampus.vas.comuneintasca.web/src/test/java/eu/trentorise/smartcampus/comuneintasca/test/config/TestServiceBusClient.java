package eu.trentorise.smartcampus.comuneintasca.test.config;

import it.sayservice.platform.client.InvocationException;
import it.sayservice.platform.client.ServiceBusClient;
import it.sayservice.platform.client.ServiceBusListener;
import it.sayservice.platform.core.message.Core.ActionInvokeParameters;

import java.util.List;
import java.util.Map;

import org.bson.types.ObjectId;

import com.google.protobuf.ByteString;

public class TestServiceBusClient implements ServiceBusClient {

	private ServiceBusListener listener = null;

	public TestServiceBusClient(ServiceBusListener listener) {
		super();
		this.listener = listener;
	}

	public void notifyData(List<ByteString> data, String serviceId, String methodName, String subscriptionId) {
		listener.onServiceEvents(serviceId, methodName, subscriptionId, data);
	}
	
	
	@Override
	public void setClientId(String clientId) throws InvocationException {
	}

	@Override
	public String getClientId() {
		return null;
	}

	@Override
	public void setListener(ServiceBusListener listener) throws InvocationException {
		this.listener = listener;
	}

	@Override
	public ActionInvokeParameters invokeService(String serviceId, String methodName, Map<String, Object> parameters) throws InvocationException {
		return null;
	}

	@Override
	public String subscribeService(String serviceId, String methodName, Map<String, Object> parameters) throws InvocationException {
		return new ObjectId().toString();
	}

	@Override
	public void unsubscribeService(String serviceId, String methodName, String subscriptionId) throws InvocationException {
	}

	@Override
	public void destroy() {
	}
	
}
