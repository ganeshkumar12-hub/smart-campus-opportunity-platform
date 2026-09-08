package com.smartcampus.backend.exception;

public class ResourceAccessException extends RuntimeException {

    public ResourceAccessException(String message) {
        super(message);
    }
}