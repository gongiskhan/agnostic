package org.agnostic.controller;

import org.agnostic.error.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: ggomes
 * Date: 09-10-2013
 * Time: 11:15
 * To change this template use File | Settings | File Templates.
 */
@ControllerAdvice
public class ExceptionController {

    HttpStatusResolver httpStatusResolver = new HttpStatusResolver();

    @ExceptionHandler(Exception.class)
    public void handle(Exception exception, HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpStatus httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        if(exception instanceof RestException){
            RestException coreException = (RestException)exception;
            if(coreException.getErrors() != null && coreException.getErrors().size() > 0){
                httpStatus = httpStatusResolver.resolve(coreException.getErrors().get(0).getCode());
            }
        }
        response.setContentType("application/json;charset=UTF-8");
        response.setHeader("Cache-Control","no-store");
        response.setHeader("Cache-Pragma","no-cache");
        response.setStatus(httpStatus.value());
        response.getWriter().write(exception.getMessage());
    }

    class HttpStatusResolver {
        public HttpStatus resolve(ErrorCode errorCode){
            if(errorCode.equals(ErrorCode.VALIDATION)){
                return HttpStatus.NOT_ACCEPTABLE;
            }else if(errorCode.equals(ErrorCode.DATABASE)){
                return HttpStatus.CONFLICT;
            }else if(errorCode.equals(ErrorCode.AUTHENTICATION)){
                return HttpStatus.BAD_REQUEST;
            }else{
                return HttpStatus.INTERNAL_SERVER_ERROR;
            }
        }
    }
}
