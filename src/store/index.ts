'use client'
import { configureStore } from '@reduxjs/toolkit'
import preferencesSlice from './slices/preferencesSlice'
import contentSlice from './slices/contentSlice'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    preferences: preferencesSlice,
    content: contentSlice,
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch