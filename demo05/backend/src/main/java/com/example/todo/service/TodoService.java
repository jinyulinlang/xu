package com.example.todo.service;

import com.example.todo.model.Todo;
import com.example.todo.repository.TodoRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class TodoService {
  private final TodoRepository repo;

  public TodoService(TodoRepository repo) {
    this.repo = repo;
  }

  public List<Todo> list(Boolean completed, Integer limit, Integer offset) {
    int l = (limit == null) ? 100 : limit;
    int o = (offset == null) ? 0 : offset;
    if (completed == null) {
      return repo.findAll(PageRequest.of(o / l, l)).getContent();
    }
    return repo.findByCompleted(completed).subList(o, Math.min(o + l, repo.findByCompleted(completed).size()));
  }

  public Todo create(Todo t) {
    t.setId(null);
    Instant now = Instant.now();
    t.setCreatedAt(now);
    t.setUpdatedAt(now);
    t.setCompleted(false);
    return repo.save(t);
  }

  public Optional<Todo> findById(Long id) {
    return repo.findById(id);
  }

  public Todo update(Long id, Todo updated) {
    Todo t = repo.findById(id).orElseThrow(() -> new RuntimeException("Todo not found"));
    t.setTitle(updated.getTitle());
    t.setDescription(updated.getDescription());
    t.setCompleted(updated.isCompleted());
    t.setPriority(updated.getPriority());
    t.setDueDate(updated.getDueDate());
    t.setUpdatedAt(Instant.now());
    return repo.save(t);
  }

  public void delete(Long id) {
    repo.deleteById(id);
  }

  @Transactional
  public Todo toggle(Long id) {
    Todo t = repo.findById(id).orElseThrow(() -> new RuntimeException("Todo not found"));
    t.setCompleted(!t.isCompleted());
    t.setUpdatedAt(Instant.now());
    return repo.save(t);
  }

  public int deleteCompleted() {
    return repo.deleteByCompletedTrue();
  }

  public int deleteAllTodos() {
    int count = (int) repo.count();
    repo.deleteAll();
    return count;
  }
}
