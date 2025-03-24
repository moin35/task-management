// src/redux/taskSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getTasksAPI,
  addTaskAPI,
  updateTaskAPI,
  deleteTaskAPI,
  updateTaskStatusAPI
} from "../api/taskApi";

// Helper functions
const mapTaskFromApi = (apiTask) => ({
  id: apiTask.id.toString(),
  name: apiTask.name,
  description: apiTask.description,
  status: apiTask.status,
  dueDate: apiTask.due_date?.split('T')[0] || ''
});

const mapTaskToApi = (frontendTask) => ({
  name: frontendTask.name,
  description: frontendTask.description,
  status: frontendTask.status,
  due_date: frontendTask.dueDate
});

// Async Thunks
export const fetchTasks = createAsyncThunk('tasks/fetchAll', async () => {
  const response = await getTasksAPI();
  return response.data;
});

export const createTask = createAsyncThunk('tasks/create', async (task) => {
  const apiTask = mapTaskToApi(task);
  const response = await addTaskAPI(apiTask);
  return response.data;
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, ...task }) => {
  const apiTask = mapTaskToApi(task);
  const response = await updateTaskAPI(id, apiTask);
  return response.data;
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id) => {
  await deleteTaskAPI(id);
  return id;
});

export const updateTaskStatus = createAsyncThunk('tasks/updateStatus', async ({ id, status }) => {
  const response = await updateTaskStatusAPI(id, status);
  return response.data;
});

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {
    optimisticUpdate: (state, action) => {
      const index = state.items.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        // Preserve original values while updating status
        state.items[index] = { 
          ...state.items[index], // Keep existing properties
          status: action.payload.status, // Update status
          _pending: true // Flag for visual feedback
        };
      }
    },
    revertUpdate: (state, action) => {
      const index = state.items.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        // Restore original task state
        state.items[index] = action.payload.original;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.map(mapTaskFromApi);
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t._pending);
        if (index !== -1) {
          state.items[index] = mapTaskFromApi(action.payload);
        }
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t.id === action.payload.id.toString());
        if (index !== -1) {
          state.items[index] = mapTaskFromApi(action.payload);
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload.toString());
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const task = state.items.find(t => t.id === action.payload.id.toString());
        if (task) task.status = action.payload.status;
      });
  }
});

// Export the optimistic update actions
export const { optimisticUpdate, revertUpdate } = taskSlice.actions;

export default taskSlice.reducer;