// store/slices/preferencesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface PreferencesState {
  darkMode: boolean
  categories: string[]
  favorites: string[]          // favorites of current user
  feedOrder: string[]
  currentUserEmail: string | null
}

const initialState: PreferencesState = {
  darkMode: false,
  categories: ['Technology', 'Sports', 'Finance'],
  favorites: [],
  feedOrder: [],
  currentUserEmail: null,
}

/* ---------- helpers for per-user storage ---------- */
const getFavoritesKey = (email: string) => `sf_favorites_${email}`

const loadFavoritesForEmail = (email: string): string[] => {
  try {
    const raw = localStorage.getItem(getFavoritesKey(email))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveFavoritesForEmail = (email: string, favorites: string[]) => {
  try {
    localStorage.setItem(getFavoritesKey(email), JSON.stringify(favorites))
  } catch {}
}

/* Optional migration: if there is an old global 'favorites' key,
   move it into the current user's key (only if user's key is empty) */
const migrateGlobalFavoritesToUser = (email: string) => {
  try {
    const global = localStorage.getItem('favorites')
    const userKey = getFavoritesKey(email)
    const userRaw = localStorage.getItem(userKey)
    if (global && !userRaw) {
      localStorage.setItem(userKey, global)
      // do not remove global key immediately to avoid unexpected data loss
      // you may remove it once you're sure migration succeeds:
      // localStorage.removeItem('favorites')
    }
  } catch {}
}

/* ---------- slice ---------- */
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
      if (typeof window !== 'undefined') {
        localStorage.setItem('darkMode', JSON.stringify(state.darkMode))
      }
    },
    updateCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('categories', JSON.stringify(action.payload))
      }
    },

    /* When user logs in (or app initializes with a user), call this
       with their email. It will load that user's favorites. */
    setCurrentUserEmail: (state, action: PayloadAction<string | null>) => {
      const email = action.payload
      state.currentUserEmail = email
      if (email && typeof window !== 'undefined') {
        // migrate if needed
        migrateGlobalFavoritesToUser(email)
        state.favorites = loadFavoritesForEmail(email)
      } else {
        state.favorites = []
      }
    },

    addToFavorites: (state, action: PayloadAction<string>) => {
      const cardId = action.payload
      if (!state.currentUserEmail) {
        // no-op if no current user; UI should prevent this
        return
      }
      if (!state.favorites.includes(cardId)) {
        state.favorites.push(cardId)
        saveFavoritesForEmail(state.currentUserEmail, state.favorites)
      }
    },

    removeFromFavorites: (state, action: PayloadAction<string>) => {
      const cardId = action.payload
      if (!state.currentUserEmail) return
      state.favorites = state.favorites.filter(id => id !== cardId)
      saveFavoritesForEmail(state.currentUserEmail, state.favorites)
    },

    updateFeedOrder: (state, action: PayloadAction<string[]>) => {
      state.feedOrder = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('feedOrder', JSON.stringify(action.payload))
      }
    },

    /* This loads general UI prefs (dark mode, categories, feedOrder).
       NOTE: we intentionally do NOT load global 'favorites' here anymore,
       because favorites are per-user and handled with setCurrentUserEmail. */
    loadFromStorage: (state) => {
      if (typeof window === 'undefined') return
      const darkMode = localStorage.getItem('darkMode')
      const categories = localStorage.getItem('categories')
      const feedOrder = localStorage.getItem('feedOrder')

      if (darkMode) state.darkMode = JSON.parse(darkMode)
      if (categories) state.categories = JSON.parse(categories)
      if (feedOrder) state.feedOrder = JSON.parse(feedOrder)
      // favorites are intentionally not loaded here (per-user)
    },

    clearFavoritesOnLogout: (state) => {
      state.favorites = []
      state.currentUserEmail = null
    },
  },
})

export const {
  toggleDarkMode,
  setDarkMode,
  updateCategories,
  setCurrentUserEmail,
  addToFavorites,
  removeFromFavorites,
  updateFeedOrder,
  loadFromStorage,
  clearFavoritesOnLogout,
} = preferencesSlice.actions

export default preferencesSlice.reducer
