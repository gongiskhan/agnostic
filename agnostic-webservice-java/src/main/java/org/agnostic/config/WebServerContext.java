package org.agnostic.config;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;

/**
 * WebServerContext Class.
 * User: ggomes
 * Date: 18/10/13
 * Time: 11:49
 */
public class WebServerContext {

    private static AnnotationConfigApplicationContext APP_CONTEXT = new AnnotationConfigApplicationContext();

    public static AnnotationConfigApplicationContext getApplicationContext(){
        return APP_CONTEXT;
    }
}
