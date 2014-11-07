package eu.trentorise.smartcampus.comuneintasca.test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.Collections;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.google.protobuf.ByteString;

import eu.trentorise.smartcampus.comuneintasca.connector.AppManager;
import eu.trentorise.smartcampus.comuneintasca.connector.ConnectorStorage;
import eu.trentorise.smartcampus.comuneintasca.data.AppSyncStorageImpl;
import eu.trentorise.smartcampus.comuneintasca.model.EventObject;
import eu.trentorise.smartcampus.comuneintasca.service.DataService;
import eu.trentorise.smartcampus.comuneintasca.test.config.TestConfig;
import eu.trentorise.smartcampus.comuneintasca.test.config.TestServiceBusClient;
import eu.trentorise.smartcampus.comuneintasca.test.util.ObjectCreator;
import eu.trentorise.smartcampus.presentation.common.exception.DataException;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {TestConfig.class})
public class TestConnector {

	@Autowired
	private MongoTemplate mongoTemplate;
	@Autowired
	private ConnectorStorage connectorStorage;
	@Autowired
	private AppManager appManager;
	@Autowired
	private DataService dataService;
	@Autowired
	private TestServiceBusClient serviceBusClient;
	
	@Before
	public void prepare() {
		mongoTemplate.dropCollection(ConnectorStorage.COLLECTION);
		mongoTemplate.dropCollection(AppSyncStorageImpl.DRAFT_COLLECTION);
		mongoTemplate.dropCollection(AppSyncStorageImpl.PUBLISH_COLLECTION);
	}
	
	@Test
	public void eventsNoConfig() throws DataException {
		List<ByteString> data = Collections.singletonList(ObjectCreator.createEventProto().toByteString());
		serviceBusClient.notifyData(data, "smartcampus.service.opendata", "GetEventiParam", "1");
		List<EventObject> events = connectorStorage.getObjectsByType(EventObject.class, ObjectCreator.TEST_APP);
		assertNotNull(events);
		assertEquals(1, events.size());
		
		List<EventObject> draftObjects = dataService.getDraftObjects(EventObject.class, ObjectCreator.TEST_APP);
		assertNotNull(draftObjects);
		assertEquals(0, draftObjects.size());

		List<EventObject> publishObjects = dataService.getDraftObjects(EventObject.class, ObjectCreator.TEST_APP);
		assertNotNull(publishObjects);
		assertEquals(0, publishObjects.size());
	}

	@Test
	public void eventsConfig() throws DataException {
		
		eventsNoConfig();
		List<ByteString> data = Collections.singletonList(ObjectCreator.createConfigProtoWithObjectId().toByteString());
		serviceBusClient.notifyData(data, "smartcampus.service.opendata", "GetConfig", "1");
		
		List<EventObject> draftObjects = dataService.getDraftObjects(EventObject.class, ObjectCreator.TEST_APP);
		assertNotNull(draftObjects);
		assertEquals(1, draftObjects.size());

		List<EventObject> publishObjects = dataService.getPublishedObjects(EventObject.class, ObjectCreator.TEST_APP);
		assertNotNull(publishObjects);
		assertEquals(1, publishObjects.size());
	}

}
