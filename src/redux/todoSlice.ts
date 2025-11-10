import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Todo } from "../types/common/Todo";
import {
  addTodoItem,
  getAllTodos,
  updateTodoStatus,
  deleteTodoItem,
  updateTodoDetails,
  addImagesToTodo,
  deleteImageFromTodo,
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
      await addTodoItem(title, description, createdBy, images);
      // Fetch all todos from database to ensure Redux stays in sync
      const todos = await getAllTodos();
      return todos;
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
      // Fetch all todos from database to ensure Redux stays in sync
      const todos = await getAllTodos();
      return todos;
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
    //before deleting, pop up confirm window to ask user if they are sure
    const confirmed = window.confirm(
      "Are you sure you want to delete this todo?"
    );
    if (!confirmed) {
      return rejectWithValue("Delete action was cancelled");
    }

    try {
      await deleteTodoItem(todoId);
      // Fetch all todos from database to ensure Redux stays in sync
      const todos = await getAllTodos();
      return todos;
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
      // Fetch all todos from database to ensure Redux stays in sync
      const todos = await getAllTodos();
      return todos;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update todo details"
      );
    }
  }
);

export const addImagesToTodoAsync = createAsyncThunk(
  "todos/addImages",
  async (
    {
      todoId,
      imageUrls,
    }: {
      todoId: string;
      imageUrls: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      await addImagesToTodo(todoId, imageUrls);
      // Fetch all todos from database to ensure Redux stays in sync
      const todos = await getAllTodos();
      return todos;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to add images to todo"
      );
    }
  }
);

export const deleteImageFromTodoAsync = createAsyncThunk(
  "todos/deleteImage",
  async (
    {
      todoId,
      imageUrl,
    }: {
      todoId: string;
      imageUrl: string;
    },
    { rejectWithValue }
  ) => {
    try {
      await deleteImageFromTodo(todoId, imageUrl);
      // Fetch all todos from database to ensure Redux stays in sync
      const todos = await getAllTodos();
      return todos;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to delete image from todo"
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
    addTodoLocal: (
      state,
      action: PayloadAction<{
        title: string;
        description: string;
        createdBy: "maria" | "leo";
        images?: string[];
      }>
    ) => {
      const newTodo: Todo & { id: string } = {
        id: `temp-${Date.now()}`,
        title: action.payload.title,
        description: action.payload.description,
        createdAt: new Date().toISOString(),
        createdBy: action.payload.createdBy,
        status: { maria: false, leo: false },
        images: action.payload.images || [],
      };
      state.todos.push(newTodo);
    },
    deleteTodoLocal: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((todo) => todo.title !== action.payload);
    },
    toggleTodoLocal: (
      state,
      action: PayloadAction<{
        todoId: string;
        user: "maria" | "leo";
        completed: boolean;
      }>
    ) => {
      const todo = state.todos.find((t) => t.id === action.payload.todoId);
      if (todo) {
        todo.status[action.payload.user] = action.payload.completed;
      }
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
        // Replace todos with database version to ensure sync
        state.todos = action.payload;
      })
      .addCase(addNewTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update todo status
    builder
      .addCase(updateTodoStatusAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTodoStatusAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Replace todos with database version to ensure sync
        state.todos = action.payload;
      })
      .addCase(updateTodoStatusAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete todo
    builder
      .addCase(deleteTodoAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTodoAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Replace todos with database version to ensure sync
        state.todos = action.payload;
      })
      .addCase(deleteTodoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update todo details
    builder
      .addCase(updateTodoDetailsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTodoDetailsAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Fetch all todos from database to ensure sync
        state.todos = action.payload;
      })
      .addCase(updateTodoDetailsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Add images to todo
    builder
      .addCase(addImagesToTodoAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addImagesToTodoAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Replace todos with database version to ensure sync
        state.todos = action.payload;
      })
      .addCase(addImagesToTodoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete image from todo
    builder
      .addCase(deleteImageFromTodoAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteImageFromTodoAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Replace todos with database version to ensure sync
        state.todos = action.payload;
      })
      .addCase(deleteImageFromTodoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setFilter,
  clearError,
  addTodoLocal,
  deleteTodoLocal,
  toggleTodoLocal,
} = todoSlice.actions;
export default todoSlice.reducer;
