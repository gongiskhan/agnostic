package org.agnostic.filter;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: ggomes
 */
@Component
public class CorsFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        response.addHeader("Access-Control-Allow-Origin", "*");
        if (request.getHeader("Access-Control-Request-Method") != null && "OPTIONS".equals(request.getMethod())) {
            response.addHeader("Access-Control-Allow-Methods","GET, POST, PUT, DELETE");
            response.addHeader("Access-Control-Allow-Headers","Accept,Cache-Control,Content-Type,Origin,Pragma,Referer,User-Agent,accept,cache-control,content-type,origin,pragma,referer,user-agent,x-requested-with,authorization,Authorization");
        }
        filterChain.doFilter(request, response);
    }
}