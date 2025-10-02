package com.example.todo.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "todos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Todo {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String title;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Column(nullable = false)
  private boolean completed = false;

  @Column(nullable = false)
  private int priority = 0;

  private Instant dueDate;

  @Column(nullable = false, updatable = false)
  private Instant createdAt = Instant.now();

  private Instant updatedAt = Instant.now();
}
