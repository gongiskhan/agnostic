package org.agnostic.config;

import com.mangofactory.swagger.core.SwaggerPathProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletContext;

/**
 * APIDocsPathProvider Class.
 * User: ggomes
 * Date: 08/05/14
 * Time: 19:18
 */
public class APIDocsPathProvider implements SwaggerPathProvider {

    private SwaggerPathProvider defaultSwaggerPathProvider;
    @Autowired
    private ServletContext servletContext;


    @Override
    public String getApiResourcePrefix() {
        return defaultSwaggerPathProvider.getApiResourcePrefix();
    }

    public String getAppBasePath() {
        return UriComponentsBuilder
                .fromHttpUrl("http://127.0.0.1:8700")
                .path(servletContext.getContextPath())
                .build()
                .toString();
    }

    @Override
    public String sanitizeRequestMappingPattern(String s) {
        return defaultSwaggerPathProvider.sanitizeRequestMappingPattern(s);
    }

    public String getSwaggerDocumentationBasePath() {
        return UriComponentsBuilder
                .fromHttpUrl(getAppBasePath())
                .pathSegment("api-docs/")
                .build()
                .toString();
    }

    public String getRequestMappingEndpoint(String requestMappingPattern) {
        return requestMappingPattern;
    }

    public void setDefaultSwaggerPathProvider(SwaggerPathProvider defaultSwaggerPathProvider) {
        this.defaultSwaggerPathProvider = defaultSwaggerPathProvider;
    }

}
