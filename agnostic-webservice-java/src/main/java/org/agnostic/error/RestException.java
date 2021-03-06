package org.agnostic.error;

import java.util.List;

/**
 * Demo Project documentation not available
 * User: ggomes
 */
public class RestException extends Exception {

    List<Error> errors;
    ErrorCode errorCode;

    public RestException(Exception exception){
        super(exception);
    }

    public RestException(String message){
        super(message);
    }

    public RestException(List<Error> errors, String errorsJSON){
        super(errorsJSON);
        this.errors = errors;
    }

    public List<Error> getErrors() {
        return errors;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(ErrorCode errorCode) {
        this.errorCode = errorCode;
    }
}
