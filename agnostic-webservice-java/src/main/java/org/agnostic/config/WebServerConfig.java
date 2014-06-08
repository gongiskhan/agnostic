package org.agnostic.config;

import org.eclipse.jetty.annotations.AnnotationConfiguration;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.util.resource.ResourceCollection;
import org.eclipse.jetty.util.thread.QueuedThreadPool;
import org.eclipse.jetty.util.thread.ThreadPool;
import org.eclipse.jetty.webapp.WebAppContext;
import org.eclipse.jetty.webapp.WebXmlConfiguration;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.annotation.Resource;
import java.io.IOException;

/**
* WebServerConfig Class.
* User: ggomes
*/
@Configuration
public class WebServerConfig {

    @Resource
    Environment environment;

    @Bean
    protected ThreadPool threadPool(){
        QueuedThreadPool threadPool = new QueuedThreadPool();
        threadPool.setMinThreads(Integer.parseInt(environment.getProperty("jetty.min.threads")));
        threadPool.setMaxThreads(Integer.parseInt(environment.getProperty("jetty.max.threads")));
        return threadPool;
    }

    @Bean
    @Qualifier("jettyServer")
    protected Server server() throws IOException {
        Server server = new Server(Integer.parseInt(environment.getProperty("jetty.port")));
        server.setThreadPool(threadPool());
        WebAppContext webAppContext = new WebAppContext();
        webAppContext.setContextPath(environment.getProperty("jetty.context.path"));
        webAppContext.setParentLoaderPriority(true);
        webAppContext.setConfigurations(new org.eclipse.jetty.webapp.Configuration[] {
                new WebXmlConfiguration(),
                new AnnotationConfiguration()
        });
        ResourceCollection resources = new ResourceCollection(new String[] {
                getWebPath()
        });
        webAppContext.setBaseResource(resources);
        webAppContext.setDescriptor(getWebXml());
        server.setHandler(webAppContext);
        return server;
    }

    public String getWebXml(){
        String path;
        boolean runningFromJAR = WebServerConfig.class.getProtectionDomain().getCodeSource().getLocation().getPath().contains(".jar");
        if(runningFromJAR){
            path = WebServerConfig.class.getClassLoader().getResource("webapp/WEB-INF/web.xml").toExternalForm();
        }else{
            path = WebServerConfig.class.getProtectionDomain().getCodeSource().getLocation().getPath()+"../../src/main/webapp/WEB-INF/web.xml";
        }
        return path;
    }

    public String getWebPath(){
        String path;
        boolean runningFromJAR = WebServerConfig.class.getProtectionDomain().getCodeSource().getLocation().getPath().contains(".jar");
        if(runningFromJAR){
            path = WebServerConfig.class.getClassLoader().getResource("webapp").toExternalForm();
        }else{
            path = WebServerConfig.class.getProtectionDomain().getCodeSource().getLocation().getPath()+"../../src/main/webapp";
        }
        return path;
    }
}
