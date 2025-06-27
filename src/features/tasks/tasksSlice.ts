import { createSlice, type PayloadAction, createSelector } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { type RootState } from '../../store';

interface Task {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

interface TasksState {
  tasks: Task[];
}

// Загружаем задачи из localStorage при инициализации
const loadTasksFromStorage = (): Task[] => {
  try {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  } catch (error) {
    console.error('Failed to parse tasks from localStorage', error);
    return [];
  }
};

const initialState: TasksState = {
  tasks: loadTasksFromStorage(),
};

// Сохраняем задачи в localStorage
const saveTasksToStorage = (tasks: Task[]) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: {
      reducer(state, action: PayloadAction<Task>) {
        state.tasks.push(action.payload);
        saveTasksToStorage(state.tasks);
      },
      prepare(title: string, userId: string) {
        return {
          payload: {
            id: uuidv4(),
            userId,
            title,
            completed: false,
            createdAt: new Date().toISOString(),
          },
        };
      },
    },
    toggleTask(state, action: PayloadAction<string>) {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        saveTasksToStorage(state.tasks);
      }
    },
    editTask(state, action: PayloadAction<{ id: string; title: string }>) {
      const task = state.tasks.find((t) => t.id === action.payload.id);
      if (task) {
        task.title = action.payload.title;
        saveTasksToStorage(state.tasks);
      }
    },
    deleteTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      saveTasksToStorage(state.tasks);
    }
  },
});

// Селекторы
const selectAllTasks = (state: RootState) => state.tasks.tasks;
const selectUserId = (_: RootState, userId: string) => userId;
const selectFilter = (_: RootState, __: string, filter: string) => filter;

export const selectUserTasks = createSelector(
  [selectAllTasks, selectUserId],
  (tasks, userId) => tasks.filter((task) => task.userId === userId)
);

export const selectFilteredTasks = createSelector(
  [selectUserTasks, selectFilter],
  (tasks, filter) => {
    switch (filter) {
      case 'completed':
        return tasks.filter((t) => t.completed);
      case 'pending':
        return tasks.filter((t) => !t.completed);
      default:
        return tasks;
    }
  }
);

export const { addTask, toggleTask, editTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;