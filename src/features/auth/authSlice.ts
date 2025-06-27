import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
//import { type RootState } from '../../store/index.ts';

interface User {
  id: string;
  email: string;
  token: string;
}

interface AuthState {
  user: User | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  status: 'idle',
  error: null
};

// Утилита для генерации тестового токена (в продакшене заменить на реальную логику)
const generateFakeToken = (email: string): string => {
  return `fake-jwt-token-${btoa(email).slice(0, 16)}-${Date.now()}`;
};

// Асинхронные операции
export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Здесь должна быть реальная регистрация через API
      // Пароль НЕ сохраняем, только для демонстрации
      return {
        id: btoa(credentials.email).slice(0, 16),
        email: credentials.email,
        token: generateFakeToken(credentials.email)
      };
    } catch (error) {
      return rejectWithValue('Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Здесь должна быть реальная аутентификация через API
      // В демо просто проверяем что пароль не пустой
      if (!credentials.password) {
        throw new Error('Password is required');
      }
      
      return {
        id: btoa(credentials.email).slice(0, 16),
        email: credentials.email,
        token: generateFakeToken(credentials.email)
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка регистрации
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'idle';
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Обработка входа
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'idle';
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

// Селекторы
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAuthStatus = (state: { auth: AuthState }) => state.auth.status;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;