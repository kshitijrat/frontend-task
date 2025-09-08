import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import bcrypt from 'bcryptjs'

interface User {
  id: string
  name: string
  email: string
  password?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

// --------------------------
// Default Test Users
// --------------------------
const defaultTestUsers: User[] = [
  { id: '1', name: 'Test User', email: 'test@example.com', password: bcrypt.hashSync('123456', 10) },
  { id: '2', name: 'Dev User', email: 'dev@example.com', password: bcrypt.hashSync('password', 10) },
]

// --------------------------
// Helpers for localStorage
// --------------------------
const USERS_KEY = 'sf_users'
const CURRENT_USER_KEY = 'sf_current_user'

const loadUsers = (): User[] => {
  if (typeof window === 'undefined') return [...defaultTestUsers]
  const saved = localStorage.getItem(USERS_KEY)
  return saved ? JSON.parse(saved) : [...defaultTestUsers]
}

const saveUsers = (users: User[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }
}

const saveCurrentUser = (user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  }
}

const loadCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null
  const saved = localStorage.getItem(CURRENT_USER_KEY)
  return saved ? JSON.parse(saved) : null
}

// --------------------------
// Thunks
// --------------------------

// Login
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    const users = loadUsers()
    const user = users.find((u) => u.email === email)
    if (!user) return rejectWithValue('User not found')

    const isMatch = await bcrypt.compare(password, user.password || '')
    if (!isMatch) return rejectWithValue('Invalid password')

    saveCurrentUser(user)
    return { id: user.id, name: user.name, email: user.email }
  }
)

// Signup
export const signupUser = createAsyncThunk(
  'auth/signup',
  async ({ name, email, password }: { name: string; email: string; password: string }, { rejectWithValue }) => {
    const users = loadUsers()
    const existingUser = users.find((u) => u.email === email)
    if (existingUser) return rejectWithValue('Email already exists')

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = { id: Date.now().toString(), name, email, password: hashedPassword }
    const updatedUsers = [...users, newUser]

    saveUsers(updatedUsers)
    saveCurrentUser(newUser)

    return { id: newUser.id, name: newUser.name, email: newUser.email }
  }
)

// Initialize auth on app load
export const initializeAuth = createAsyncThunk('auth/initialize', async () => {
  const user = loadCurrentUser()
  return user ? { id: user.id, name: user.name, email: user.email } : null
})

// --------------------------
// Slice
// --------------------------
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.isAuthenticated = false
      if (typeof window !== 'undefined') {
        localStorage.removeItem(CURRENT_USER_KEY)
      }
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signupUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Initialize
      .addCase(initializeAuth.fulfilled, (state, action: PayloadAction<User | null>) => {
        if (action.payload) {
          state.user = action.payload
          state.isAuthenticated = true
        }
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
