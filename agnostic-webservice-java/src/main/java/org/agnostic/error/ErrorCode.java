package org.agnostic.error;

/**
 * ErrorCode Class.
 * User: ggomes
 */
public enum ErrorCode {
    VALIDATION(400),
    DATABASE(500),
    DUPLICATE(409),
    REFERENCED(202),
    AUTHENTICATION(401);

    private final int code;
    ErrorCode(int code){
        this.code = code;
    }
    public int getValue(){return code;}
}
