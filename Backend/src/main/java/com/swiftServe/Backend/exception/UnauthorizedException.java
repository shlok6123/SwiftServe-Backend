package com.swiftServe.Backend.exception;

/**
 * Thrown when a request fails authentication or token validation.
 * Maps to HTTP 401 Unauthorized via {@link GlobalExceptionHandler}.
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }
}
