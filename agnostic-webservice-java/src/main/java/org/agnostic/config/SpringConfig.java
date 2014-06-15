package org.agnostic.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.InternalResourceView;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

/**
 * User: ggomes
 * Date: 12-01-2014
 * Time: 14:29
 * Copyright Tango Telecom 2014
 */
@Configuration
@EnableWebMvc
@Import(value = {APIDocsConfig.class, ServiceConfig.class, SecurityConfig.class})
@ComponentScan(basePackages = {"org.agnostic.controller", "org.agnostic.filter", "org.agnostic.util"})
public class SpringConfig extends WebMvcConfigurerAdapter {

    @Bean
    public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }
    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer)
    {
        configurer.enable();
    }
    @Bean
    public ViewResolver resolver()
    {
        InternalResourceViewResolver vr = new InternalResourceViewResolver();
        vr.setPrefix("/apidocs/");
        vr.setViewClass(InternalResourceView.class);
        vr.setSuffix(".html");
        return vr;
    }

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        MappingJackson2HttpMessageConverter mappingJacksonHttpMessageConverter = new MappingJackson2HttpMessageConverter();
        List<MediaType> mediaTypes = new ArrayList<MediaType>();
        mediaTypes.add(MediaType.APPLICATION_JSON);
        mappingJacksonHttpMessageConverter.setSupportedMediaTypes(mediaTypes);
        mappingJacksonHttpMessageConverter.getObjectMapper().setDateFormat(new SimpleDateFormat("yyyy/MM/dd"));
        converters.add(mappingJacksonHttpMessageConverter);
    }
}
