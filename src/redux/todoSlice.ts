import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Todo } from "../types/common/Todo";
import {
  addTodoItem,
  getAllTodos,
  updateTodoStatus,
  deleteTodoItem,
  updateTodoDetails,
} from "../apis/checklistApis";

interface TodoState {
  todos: (Todo & { id: string })[];
  loading: boolean;
  error: string | null;
  filter: "all" | "completed" | "pending";
}

const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
  filter: "all",
};

// Async Thunks
export const fetchAllTodos = createAsyncThunk(
  "todos/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const todos = await getAllTodos();
      return todos;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch todos"
      );
    }
  }
);

export const addNewTodo = createAsyncThunk(
  "todos/addNew",
  async (
    {
      title,
      description,
      createdBy,
      images,
    }: {
      title: string;
      description: string;
      createdBy: "maria" | "leo";
      images?: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const todoId = await addTodoItem(title, description, createdBy, images);
      return {
        id: todoId,
        title,
        description,
        createdAt: new Date().toISOString().split("T")[0],
        createdBy,
        status: { maria: false, leo: false },
        images: images || [],
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to add todo"
      );
    }
  }
);

export const updateTodoStatusAsync = createAsyncThunk(
  "todos/updateStatus",
  async (
    {
      todoId,
      user,
      completed,
    }: {
      todoId: string;
      user: "maria" | "leo";
      completed: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      await updateTodoStatus(todoId, user, completed);
      return { todoId, user, completed };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update todo status"
      );
    }
  }
);

export const deleteTodoAsync = createAsyncThunk(
  "todos/delete",
  async (todoId: string, { rejectWithValue }) => {
    try {
      await deleteTodoItem(todoId);
      return todoId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete todo"
      );
    }
  }
);

export const updateTodoDetailsAsync = createAsyncThunk(
  "todos/updateDetails",
  async (
    {
      todoId,
      title,
      description,
    }: {
      todoId: string;
      title: string;
      description: string;
    },
    { rejectWithValue }
  ) => {
    try {
      await updateTodoDetails(todoId, title, description);
      return { todoId, title, description };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update todo details"
      );
    }
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setFilter: (
      state,
      action: PayloadAction<"all" | "completed" | "pending">
    ) => {
      state.filter = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    addTodoLocal: (state, action: PayloadAction<Todo & { id: string }>) => {
      state.todos.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    // Fetch all todos
    builder
      .addCase(fetchAllTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(fetchAllTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Add new todo
    builder
      .addCase(addNewTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.todos.push(action.payload);
      })
      .addCase(addNewTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update todo status
    builder
      .addCase(updateTodoStatusAsync.fulfilled, (state, action) => {
        const todo = state.todos.find((t) => t.id === action.payload.todoId);
        if (todo) {
          todo.status[action.payload.user] = action.payload.completed;
        }
      })
      .addCase(updateTodoStatusAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Delete todo
    builder
      .addCase(deleteTodoAsync.fulfilled, (state, action) => {
        state.todos = state.todos.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTodoAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Update todo details
    builder
      .addCase(updateTodoDetailsAsync.fulfilled, (state, action) => {
        const todo = state.todos.find((t) => t.id === action.payload.todoId);
        if (todo) {
          todo.title = action.payload.title;
          todo.description = action.payload.description;
        }
      })
      .addCase(updateTodoDetailsAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setFilter, clearError, addTodoLocal } = todoSlice.actions;
export default todoSlice.reducer;
