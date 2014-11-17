package it.smartcommunitylab.comuneintasca.core.controller;

import it.smartcommunitylab.comuneintasca.core.model.AppObject;
import it.smartcommunitylab.comuneintasca.core.model.AppSettings;
import it.smartcommunitylab.comuneintasca.core.model.TypeConstants;
import it.smartcommunitylab.comuneintasca.core.security.AppSetup;
import it.smartcommunitylab.comuneintasca.core.security.CustomAuthenticationProvider.AppDetails;
import it.smartcommunitylab.comuneintasca.core.service.DataService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import eu.trentorise.smartcampus.presentation.common.exception.DataException;

@Controller
public class ConsoleController {

	@Autowired
	private DataService dataService; 
	@Autowired
	private AppSetup appSetup;
	
	@RequestMapping("/")
	public String home() {
		return "index";
	}

	@RequestMapping("/login")
	public String login() {
		return "login";
	}

	@RequestMapping("/console/data")
	public @ResponseBody AppSettings getApp() throws DataException {
		AppDetails details = (AppDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String app = details.getUsername();
		return appSetup.findAppById(app);
	}
	
	
	@RequestMapping(value="/console/{app}/publish", method=RequestMethod.PUT)
//	@PreAuthorize("hasAuthority('#app')")
	public @ResponseBody void publishApp(@PathVariable String app) throws DataException {
		dataService.publishApp(app);
	}
	@RequestMapping(value="/console/{app}/publish/{type}", method=RequestMethod.PUT)
	@PreAuthorize("hasAuthority('#app')")
	public @ResponseBody void publishAppType(@PathVariable String app, @PathVariable String type) throws DataException {
		dataService.publishType(mapTypeToClass(type), app, null);
	}
	
	@SuppressWarnings("unchecked")
	private <T extends AppObject> Class<T> mapTypeToClass(String type) {
		return (Class<T>) TypeConstants.getTypeMapping(type);
	}

}
