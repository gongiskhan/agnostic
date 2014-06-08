package org.agnostic;

import org.agnostic.config.WebServerConfig;
import org.agnostic.config.WebServerContext;
import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.log4j.PropertyConfigurator;
import org.eclipse.jetty.server.Server;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.support.PropertiesLoaderUtils;

import java.net.URL;
import java.util.Arrays;

/**
 * This is the starting point of the application. It's main function is to start the Web Server and the web application.
 */
public class Runner {

    static Logger logger = LoggerFactory.getLogger(Runner.class);

    public static void main(String[] args) {
        try {
            new Runner().run(args);
        } catch (Exception e) {
            e.printStackTrace();
            System.exit(1);
        }
    }

    private void run(String[] args) throws Exception {

        //Specifically load log4j configuration (Doesn't seem to get picked it up while running from Jetty).
        URL log4jUrl = Runner.class.getProtectionDomain().getClassLoader().getResource("log4j.properties");
        if(log4jUrl != null){
            PropertyConfigurator.configure(log4jUrl);
        }

        logger.info("Arguments sent to main class: "+ Arrays.toString(args));

        // create Options object
        Options options = new Options();
        // add option
        options.addOption("jetty_port", true, null);
        options.addOption("jetty_context_path", true, null);
        options.addOption("jetty_min_threads", true, null);
        options.addOption("jetty_max_threads", true, null);
        options.addOption("log4j_appender_RootAppender_File", true, null);

        CommandLineParser parser = new PosixParser();
        CommandLine cmd = parser.parse(options, args);

        ClassPathResource classPathProperties = new ClassPathResource("webserver.properties");
        if(classPathProperties.exists()){
            System.getProperties().putAll(PropertiesLoaderUtils.loadProperties(classPathProperties));
        }

        for(Object option : options.getOptions()){
            if (cmd.hasOption(option.toString()))
                System.setProperty(option.toString().replaceAll("_","."), cmd.getOptionValue(option.toString()));
        }

        //This application context is only for starting the server. Not the one actually used by the application.
        WebServerContext.getApplicationContext().register(WebServerConfig.class);
        WebServerContext.getApplicationContext().refresh();
        WebServerContext.getApplicationContext().start();

        Server server = WebServerContext.getApplicationContext().getBean(Server.class);
        server.start();

        //TODO: destroy context.
        //TODO: ensure server stops when app dies (e.g. there is an error while creating the dispatcher servlet context).

        server.join();
    }
}
