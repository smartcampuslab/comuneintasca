package eu.trentorise.smartcampus.comuneintasca.test.util;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import eu.trentorise.smartcampus.comuneintasca.model.EventObject;
import eu.trentorise.smartcampus.comuneintasca.service.DataService;
import eu.trentorise.smartcampus.comuneintasca.test.config.TestConfig;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {TestConfig.class})
public class TestDataService {

	@Autowired
	private DataService dataService;
	
	@Test
	public void getAppData() {
		dataService.getPublishedObjects(EventObject.class, "TrentoInTasca");
	}
}
