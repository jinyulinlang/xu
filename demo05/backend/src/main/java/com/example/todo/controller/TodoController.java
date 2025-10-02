package com.example.todo.controller;

import com.example.todo.model.Todo;
import com.example.todo.service.TodoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/todos")
@CrossOrigin(origins = "http://localhost:5173")
public class TodoController {
  private final TodoService service;

  public TodoController(TodoService service) {
    this.service = service;
  }

  @GetMapping
  public ResponseEntity<?> list(@RequestParam(required = false) Boolean completed,
      @RequestParam(required = false) Integer limit,
      @RequestParam(required = false) Integer offset) {
    List<Todo> data = service.list(completed, limit, offset);
    Map<String, Object> resp = new HashMap<>();
    resp.put("code", 200);
    resp.put("message", "success");
    resp.put("data", data);
    resp.put("total", data.size());
    return ResponseEntity.ok(resp);
  }

  @PostMapping
  public ResponseEntity<?> create(@RequestBody Todo todo) {
    Todo created = service.create(todo);
    Map<String, Object> resp = new HashMap<>();
    resp.put("code", 201);
    resp.put("message", "Todo created successfully");
    resp.put("data", created);
    return ResponseEntity.status(HttpStatus.CREATED).body(resp);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Todo todo) {
    Todo updated = service.update(id, todo);
    Map<String, Object> resp = new HashMap<>();
    resp.put("code", 200);
    resp.put("message", "Todo updated successfully");
    resp.put("data", updated);
    return ResponseEntity.ok(resp);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> delete(@PathVariable Long id) {
    service.delete(id);
    Map<String, Object> resp = new HashMap<>();
    resp.put("code", 200);
    resp.put("message", "Todo deleted successfully");
    return ResponseEntity.ok(resp);
  }

  @PatchMapping("/{id}/toggle")
  public ResponseEntity<?> toggle(@PathVariable Long id) {
    Todo t = service.toggle(id);
    Map<String, Object> resp = new HashMap<>();
    resp.put("code", 200);
    resp.put("message", "Todo status toggled successfully");
    Map<String, Object> data = new HashMap<>();
    data.put("id", t.getId());
    data.put("completed", t.isCompleted());
    data.put("updated_at", t.getUpdatedAt());
    resp.put("data", data);
    return ResponseEntity.ok(resp);
  }

  @DeleteMapping("/completed")
  public ResponseEntity<?> deleteCompleted() {
    int deleted = service.deleteCompleted();
    Map<String, Object> resp = new HashMap<>();
    resp.put("code", 200);
    resp.put("message", "Completed todos deleted successfully");
    resp.put("deleted_count", deleted);
    return ResponseEntity.ok(resp);
  }

  @DeleteMapping("/all")
  public ResponseEntity<?> deleteAll() {
    int deleted = service.deleteAllTodos();
    Map<String, Object> resp = new HashMap<>();
    resp.put("code", 200);
    resp.put("message", "All todos deleted successfully");
    resp.put("deleted_count", deleted);
    return ResponseEntity.ok(resp);
  }
}
