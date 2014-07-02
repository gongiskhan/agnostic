package org.agnostic.error;

import org.agnostic.util.JSONUtil;
import org.h2.jdbc.JdbcSQLException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * User: ggomes
 */
@Component
public class ExceptionFactory {

    @Autowired
    JSONUtil jsonUtil;

    public RestException createException(Exception exception) {
        RestException rex;
        if(exception instanceof ConstraintViolationException){
            rex = create((ConstraintViolationException)exception);
        }
        else if(exception instanceof JpaSystemException){
            rex = create((JpaSystemException)exception);
        }else if(exception instanceof JdbcSQLException){
            rex = create((JdbcSQLException)exception);
        }else{
            rex = new RestException(exception);
        }
        for(Error r : rex.getErrors()){
            if(r.getCode() != null){
                rex.setErrorCode(r.getCode());
                break;
            }
        }
        return rex;
    }

    private RestException create(ConstraintViolationException originalException){

        List<Error> errors = new ArrayList<Error>();
        for(ConstraintViolation violation : originalException.getConstraintViolations()){
            Error error = new Error();
            error.setCode(ErrorCode.VALIDATION);
            error.setObjectName(violation.getRootBean().getClass().getSimpleName());
            error.setProperty(violation.getPropertyPath().toString());
            error.setMessage(violation.getMessage());
            errors.add(error);
        }

        String errorsJSON = "";
        try {
            errorsJSON = jsonUtil.toJSON(errors);
        } catch (IOException e) {
            return new RestException(originalException);
        }

        return new RestException(errors, errorsJSON);
    }

    private RestException create(JpaSystemException originalException){

        List<Error> errors = new ArrayList<Error>();
        Error error = new Error();
        error.setMessage(originalException.getMessage());
        error.setCode(ErrorCode.DATABASE);
        errors.add(error);

        String errorsJSON = "";
        try {
            errorsJSON = jsonUtil.toJSON(errors);
        } catch (IOException e) {
            return new RestException(originalException);
        }

        return new RestException(errors, errorsJSON);
    }

    private RestException create(JdbcSQLException originalException){

        List<Error> errors = new ArrayList<Error>();
        Error error = new Error();
        error.setMessage(originalException.getMessage());
        if(originalException.getMessage().contains("not found")){
            error.setCode(ErrorCode.OBJECT_DOES_NOT_EXIST);
        }else{
            error.setCode(ErrorCode.DATABASE);
        }
        errors.add(error);

        String errorsJSON = "";
        try {
            errorsJSON = jsonUtil.toJSON(errors);
        } catch (IOException e) {
            return new RestException(originalException);
        }

        return new RestException(errors, errorsJSON);
    }
}
