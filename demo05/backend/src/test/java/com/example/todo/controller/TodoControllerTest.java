package com.example.todo.controller;

import com.example.todo.controller.TodoController;
import com.example.todo.model.Todo;
import com.example.todo.service.TodoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class TodoControllerTest {
  private MockMvc mvc;

  private final ObjectMapper mapper = new ObjectMapper();

  @BeforeEach
  public void setup() {
    // create mock service and controller manually to avoid Mockito annotation
    // lifecycle issues
    TodoService service = org.mockito.Mockito.mock(TodoService.class);
    TodoController controller = new TodoController(service);
    mvc = MockMvcBuilders.standaloneSetup(controller).build();

    // store service in request attribute for stubbing later via a field? we'll just
    // recreate stubs in test
  }

  @Test
  public void testCreateAndList() throws Exception {
    // create fresh mock and controller for this test so we can stub behavior
    TodoService service = org.mockito.Mockito.mock(TodoService.class);
    TodoController controller = new TodoController(service);
    mvc = MockMvcBuilders.standaloneSetup(controller).build();

    Todo t = Todo.builder().title("itest").description("desc").priority(1).build();
    Todo saved = Todo.builder().id(1L).title("itest").description("desc").priority(1).build();
    org.mockito.Mockito.when(service.create(org.mockito.ArgumentMatchers.any(Todo.class))).thenReturn(saved);
    org.mockito.Mockito.when(service.list(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.any(),
        org.mockito.ArgumentMatchers.any())).thenReturn(List.of(saved));

    String json = mapper.writeValueAsString(t);
    mvc.perform(post("/api/v1/todos").contentType(MediaType.APPLICATION_JSON).content(json))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.data.title").value("itest"));

    mvc.perform(get("/api/v1/todos")).andExpect(status().isOk()).andExpect(jsonPath("$.total").value(1));
  }
}
