package org.agnostic.config;

import org.agnostic.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

/**
 * Created by ggomes on 28/05/14.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    UserService userService;

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userService);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.httpBasic().and().csrf().disable()
        .authorizeRequests().antMatchers("/api-docs", "/apidocs/images/*", "/apidocs/css/*", "/apidocs/lib/*", "/api-docs/*", "/apidocs/*", "/apidoc*").permitAll()
        .and().authorizeRequests().antMatchers(HttpMethod.OPTIONS,"/**").permitAll()
        .and().authorizeRequests().antMatchers(HttpMethod.GET,"/**").permitAll()
        .anyRequest().authenticated();
    }
}