package it.smartcommunitylab.comuneintasca.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.servlet.configuration.EnableWebMvcSecurity;

@Configuration
@EnableWebMvcSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{

//	@Autowired
//	private AuthenticationProvider customAuthenticationProvider;

	@Override
	protected void configure(HttpSecurity http) throws Exception {
	        http
	        	.csrf()
	        	.disable()
//	        	.authenticationProvider(customAuthenticationProvider)
	            .authorizeRequests()
	                .anyRequest()
	                	.permitAll();
	 }

}
