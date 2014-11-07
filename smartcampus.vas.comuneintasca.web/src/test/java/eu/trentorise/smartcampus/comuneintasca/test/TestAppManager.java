package eu.trentorise.smartcampus.comuneintasca.test;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import eu.trentorise.smartcampus.comuneintasca.connector.App;
import eu.trentorise.smartcampus.comuneintasca.connector.AppManager;
import eu.trentorise.smartcampus.comuneintasca.test.config.TestConfig;
import eu.trentorise.smartcampus.presentation.common.exception.DataException;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {TestConfig.class})
public class TestAppManager {

	@Autowired
	private AppManager manager;
	
	@Autowired
	private MongoTemplate mongoTemplate;
	
	@Test
	public void getAppData() throws DataException {
		App app = manager.getApp("smartcampus.service.opendata", "GetEvetiParam", "1");
		assertNotNull(app);

		app = manager.getApp("smartcampus.service.opendata", "Test3", "1");
		assertNull(app);
	}
	
	
}
