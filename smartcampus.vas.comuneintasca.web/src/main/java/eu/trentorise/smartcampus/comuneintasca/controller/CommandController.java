package eu.trentorise.smartcampus.comuneintasca.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import eu.trentorise.smartcampus.comuneintasca.processor.EventProcessorImpl;

@Controller
public class CommandController {

	@Autowired
	private EventProcessorImpl eventProcessor;
	
	@RequestMapping(method = RequestMethod.POST, value = "/reloadConfig")
	public @ResponseBody void reload() throws Exception {
		eventProcessor.retrieveConfig();
	}	
	
//	@RequestMapping(method = RequestMethod.POST, value = "/reloadData")
//	public @ResponseBody void reloadData() throws Exception {
//		eventProcessor.retrieveMissingData();
//	}	

}
