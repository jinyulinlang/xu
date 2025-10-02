package com.example.todo.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<?> handleRuntime(RuntimeException ex) {
    Map<String, Object> resp = new HashMap<>();
    resp.put("code", 404);
    resp.put("message", ex.getMessage());
    resp.put("detail", ex.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resp);
  }
}
