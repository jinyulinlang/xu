package com.example.todo.repository;

import com.example.todo.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {
  List<Todo> findByCompleted(boolean completed);

  @Transactional
  @Modifying
  @Query("delete from Todo t where t.completed = true")
  int deleteByCompletedTrue();
}
