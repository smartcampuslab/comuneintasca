package eu.trentorise.smartcampus.comuneintasca.test.config;

import it.sayservice.platform.client.InvocationException;
import it.sayservice.platform.client.ServiceBusClient;
import it.sayservice.platform.client.ServiceBusListener;
import it.sayservice.platform.core.message.Core.ActionInvokeParameters;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import com.google.protobuf.ByteString;

public class TestServiceBusClient implements ServiceBusClient {

	@Autowired
	private ServiceBusListener listener = null;

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
		return "1";
	}

	@Override
	public void unsubscribeService(String serviceId, String methodName, String subscriptionId) throws InvocationException {
	}

	@Override
	public void destroy() {
	}
	
}
