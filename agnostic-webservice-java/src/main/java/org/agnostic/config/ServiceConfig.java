package org.agnostic.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * Created by ggomes on 28/05/14.
 */
@Configuration
@ComponentScan("org.agnostic.service")
@Import(PersistenceConfig.class)
public class ServiceConfig {}
