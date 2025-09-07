'use client'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface PreferencesState {
  darkMode: boolean
  categories: string[]
  favorites: string[]
  feedOrder: string[]
}

const initialState: PreferencesState = {
  darkMode: false,
  categories: ['Technology', 'Sports', 'Finance'],
  favorites: [],
  feedOrder: [],
}

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
      if (typeof window !== 'undefined') {
        localStorage.setItem('darkMode', JSON.stringify(state.darkMode))
      }
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload
    },
    updateCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('categories', JSON.stringify(action.payload))
      }
    },
    addToFavorites: (state, action: PayloadAction<string>) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload)
        if (typeof window !== 'undefined') {
          localStorage.setItem('favorites', JSON.stringify(state.favorites))
        }
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(id => id !== action.payload)
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify(state.favorites))
      }
    },
    updateFeedOrder: (state, action: PayloadAction<string[]>) => {
      state.feedOrder = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('feedOrder', JSON.stringify(action.payload))
      }
    },
    loadFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const darkMode = localStorage.getItem('darkMode')
        const categories = localStorage.getItem('categories')
        const favorites = localStorage.getItem('favorites')
        const feedOrder = localStorage.getItem('feedOrder')
        
        if (darkMode) state.darkMode = JSON.parse(darkMode)
        if (categories) state.categories = JSON.parse(categories)
        if (favorites) state.favorites = JSON.parse(favorites)
        if (feedOrder) state.feedOrder = JSON.parse(feedOrder)
      }
    },
  },
})

export const {
  toggleDarkMode,
  setDarkMode,
  updateCategories,
  addToFavorites,
  removeFromFavorites,
  updateFeedOrder,
  loadFromStorage,
} = preferencesSlice.actions

export default preferencesSlice.reducer