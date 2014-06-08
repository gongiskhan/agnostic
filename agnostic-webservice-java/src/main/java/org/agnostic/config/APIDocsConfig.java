package org.agnostic.config;

import com.mangofactory.swagger.authorization.AuthorizationContext;
import com.mangofactory.swagger.configuration.JacksonScalaSupport;
import com.mangofactory.swagger.configuration.SpringSwaggerConfig;
import com.mangofactory.swagger.configuration.SwaggerGlobalSettings;
import com.mangofactory.swagger.core.SwaggerApiResourceListing;
import com.mangofactory.swagger.scanners.ApiListingReferenceScanner;
import com.wordnik.swagger.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
* APIDocsConfig Class.
* User: ggomes
* Date: 08/05/14
* Time: 19:08
*/
@Configuration
@ComponentScan(value={"com.mangofactory.swagger.configuration","com.mangofactory.swagger.controllers"})
public class APIDocsConfig {

    public static final List<String> DEFAULT_INCLUDE_PATTERNS = Arrays.asList(new String[]{
            "agnostic"
    });
    public static final String SWAGGER_GROUP = "agnostic";

    @Autowired
    private SpringSwaggerConfig springSwaggerConfig;


    /**
     * Adds the jackson scala module to the MappingJackson2HttpMessageConverter registered with spring
     * Swagger core models are scala so we need to be able to convert to JSON
     * Also registers some custom serializers needed to transform swagger models to swagger-ui required json format
     */
//    @Bean
//    public JacksonScalaSupport jacksonScalaSupport() {
//        JacksonScalaSupport jacksonScalaSupport = new JacksonScalaSupport();
//        //Set to false to disable
//        jacksonScalaSupport.setRegisterScalaModule(true);
//        return jacksonScalaSupport;
//    }


    /**
     * Global swagger settings
     */
    @Bean
    public SwaggerGlobalSettings swaggerGlobalSettings() {
        SwaggerGlobalSettings swaggerGlobalSettings = new SwaggerGlobalSettings();
        swaggerGlobalSettings.setGlobalResponseMessages(springSwaggerConfig.defaultResponseMessages());
        swaggerGlobalSettings.setIgnorableParameterTypes(springSwaggerConfig.defaultIgnorableParameterTypes());
        swaggerGlobalSettings.setAlternateTypeProvider(springSwaggerConfig.defaultAlternateTypeProvider());
        return swaggerGlobalSettings;
    }

    /**
     * API Info as it appears on the swagger-ui page
     */
    private ApiInfo apiInfo() {
        ApiInfo apiInfo = new ApiInfo(
                "Agnostic CMS 1.0 API",
                "REST webservice for CRUD operatoins on Agnostic CMS data.",
                "http://en.wikipedia.org/wiki/Terms_of_service",
                "goncalo.p.gomes@googlemail.com",
                "Apache 2.0",
                "http://www.apache.org/licenses/LICENSE-2.0.html"
        );
        return apiInfo;
    }

    /**
     * Configure a SwaggerApiResourceListing for each swagger instance within your app. e.g. 1. private  2. external apis
     * Required to be a spring bean as spring will call the postConstruct method to bootstrap swagger scanning.
     *
     * @return
     */
    @Bean
    public SwaggerApiResourceListing swaggerApiResourceListing() {
        //The group name is important and should match the group set on ApiListingReferenceScanner
        //Note that swaggerCache() is by DefaultSwaggerController to serve the swagger json
        SwaggerApiResourceListing swaggerApiResourceListing = new SwaggerApiResourceListing(springSwaggerConfig.swaggerCache(), SWAGGER_GROUP);

        //Set the required swagger settings
        swaggerApiResourceListing.setSwaggerGlobalSettings(swaggerGlobalSettings());

        //Use a custom path provider or springSwaggerConfig.defaultSwaggerPathProvider()
        swaggerApiResourceListing.setSwaggerPathProvider(pathProvider());

        //Supply the API Info as it should appear on swagger-ui web page
        swaggerApiResourceListing.setApiInfo(apiInfo());

        //Global authorization - see the swagger documentation
        swaggerApiResourceListing.setAuthorizationTypes(authorizationTypes());

        //Sets up an auth context - i.e. which config request paths to apply global auth to
        swaggerApiResourceListing.setAuthorizationContext(authorizationContext());

        //Every SwaggerApiResourceListing needs an ApiListingReferenceScanner to scan the spring request mappings
        swaggerApiResourceListing.setApiListingReferenceScanner(apiListingReferenceScanner());
        return swaggerApiResourceListing;
    }

    @Bean
    /**
     * The ApiListingReferenceScanner does most of the work.
     * Scans the appropriate spring RequestMappingHandlerMappings
     * Applies the correct absolute paths to the generated swagger resources
     */
    public ApiListingReferenceScanner apiListingReferenceScanner() {
        ApiListingReferenceScanner apiListingReferenceScanner = new ApiListingReferenceScanner();

        //Picks up all of the registered spring RequestMappingHandlerMappings for scanning
        apiListingReferenceScanner.setRequestMappingHandlerMapping(springSwaggerConfig.swaggerRequestMappingHandlerMappings());

        //Excludes any controllers with the supplied annotations
        apiListingReferenceScanner.setExcludeAnnotations(springSwaggerConfig.defaultExcludeAnnotations());

        //
        apiListingReferenceScanner.setResourceGroupingStrategy(springSwaggerConfig.defaultResourceGroupingStrategy());

        //Path provider used to generate the appropriate uri's
        apiListingReferenceScanner.setSwaggerPathProvider(pathProvider());

        //Must match the swagger group set on the SwaggerApiResourceListing
        apiListingReferenceScanner.setSwaggerGroup(SWAGGER_GROUP);

        //Only include paths that match the supplied regular expressions
        //apiListingReferenceScanner.setIncludePatterns(DEFAULT_INCLUDE_PATTERNS);

        return apiListingReferenceScanner;
    }

    /**
     * Example of a custom path provider
     */
    @Bean
    public APIDocsPathProvider pathProvider() {
        APIDocsPathProvider pathProvider = new APIDocsPathProvider();
        pathProvider.setDefaultSwaggerPathProvider(springSwaggerConfig.defaultSwaggerPathProvider());
        return pathProvider;
    }


    private List<AuthorizationType> authorizationTypes() {
        ArrayList<AuthorizationType> authorizationTypes = new ArrayList<AuthorizationType>();


        List<AuthorizationScope> authorizationScopeList = new ArrayList();
        authorizationScopeList.add(new AuthorizationScope("global", "access all"));


        List<GrantType> grantTypes = new ArrayList();

        LoginEndpoint loginEndpoint = new LoginEndpoint("http://localhost:8700/login");
        grantTypes.add(new ImplicitGrant(loginEndpoint, "access_token"));

        TokenRequestEndpoint tokenRequestEndpoint = new TokenRequestEndpoint("http://localhost:8700/login", "client_id", "client_secret");
        TokenEndpoint tokenEndpoint = new TokenEndpoint("http://localhost:8700/login", "auth_code");

        AuthorizationCodeGrant authorizationCodeGrant = new AuthorizationCodeGrant(tokenRequestEndpoint, tokenEndpoint);
        grantTypes.add(authorizationCodeGrant);

        OAuth oAuth = new OAuthBuilder()
                .scopes(authorizationScopeList)
                .grantTypes(grantTypes)
                .build();

        authorizationTypes.add(oAuth);
        return authorizationTypes;
    }

    @Bean
    public AuthorizationContext authorizationContext() {
        List<Authorization> authorizations = new ArrayList();

        AuthorizationScope authorizationScope = new AuthorizationScope("global", "accessEverything");
        AuthorizationScope[] authorizationScopes = new AuthorizationScope[]{authorizationScope};
        authorizations.add(new Authorization("basic", authorizationScopes));
        AuthorizationContext authorizationContext =
                new AuthorizationContext.AuthorizationContextBuilder(authorizations)
                        .build();
        return authorizationContext;
    }
}
