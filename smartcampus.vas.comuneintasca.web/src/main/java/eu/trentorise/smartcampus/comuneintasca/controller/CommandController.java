package eu.trentorise.smartcampus.comuneintasca.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import eu.trentorise.smartcampus.comuneintasca.service.DataService;

@Controller
public class CommandController {

	@Autowired
	private DataService service;
	
	@RequestMapping(method = RequestMethod.POST, value = "/publish/{appId}")
	public @ResponseBody void publish(@PathVariable String appId) throws Exception {
		service.publishApp(appId);
	}	
	
}
