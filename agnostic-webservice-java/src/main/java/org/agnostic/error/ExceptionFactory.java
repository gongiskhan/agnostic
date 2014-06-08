package org.agnostic.error;

import org.agnostic.util.JSONUtil;
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

    public RestException throwException(Exception exception) {
        if(exception instanceof ConstraintViolationException){
            return create((ConstraintViolationException)exception);
        }
        else if(exception instanceof JpaSystemException){
            return create((JpaSystemException)exception);
        }else{
            return new RestException(exception);
        }
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
}
