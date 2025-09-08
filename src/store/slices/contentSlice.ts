'use client'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// ----- API response types -----
interface NewsArticle {
  title: string
  description?: string
  urlToImage?: string
  url: string
  author?: string
  publishedAt: string
  category?: string
}

interface MovieResult {
  id: number
  title: string
  overview?: string
  poster_path?: string
  release_date?: string
  vote_average?: number
}

interface SocialPost {
  id: number | string
  username: string
  caption: string
  image?: string
  createdAt: string
}

// ----- Content item type -----
export interface ContentItem {
  id: string
  type: 'news' | 'movie' | 'social'
  title: string
  description?: string
  image?: string
  url?: string
  author?: string
  publishedAt?: string
  category?: string
  rating?: number
  isFavorite?: boolean
}

// ----- Slice state -----
interface ContentState {
  items: ContentItem[]
  loading: boolean
  error: string | null
  searchQuery: string
  searchResults: ContentItem[]
  trendingItems: ContentItem[]
}

const initialState: ContentState = {
  items: [],
  loading: false,
  error: null,
  searchQuery: '',
  searchResults: [],
  trendingItems: [],
}

// ----- Async thunks -----
export const fetchNews = createAsyncThunk(
  'content/fetchNews',
  async (category: string = 'general'): Promise<NewsArticle[]> => {
    const response = await fetch(`/api/news?category=${category}`)
    const data = await response.json()
    return data.articles || []
  }
)

export const fetchMovies = createAsyncThunk(
  'content/fetchMovies',
  async (): Promise<MovieResult[]> => {
    const response = await fetch('/api/movies')
    const data = await response.json()
    return data.results || []
  }
)

export const fetchSocialPosts = createAsyncThunk(
  'content/fetchSocialPosts',
  async (): Promise<SocialPost[]> => {
    const response = await fetch('/api/social')
    const data = await response.json()
    return data.posts || []
  }
)

// ----- Slice -----
const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setSearchResults: (state, action: PayloadAction<ContentItem[]>) => {
      state.searchResults = action.payload
    },
    reorderItems: (state, action: PayloadAction<ContentItem[]>) => {
      state.items = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    updateTrending: (state) => {
      const trending = state.items
        .filter(item => item.rating && item.rating > 7)
        .sort((a, b) => {
          const dateA = new Date(a.publishedAt || '').getTime()
          const dateB = new Date(b.publishedAt || '').getTime()
          return dateB - dateA
        })
        .slice(0, 5)
      state.trendingItems = trending
    },
  },
  extraReducers: (builder) => {
    // News
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNews.fulfilled, (state, action: PayloadAction<NewsArticle[]>) => {
        state.loading = false
        const newsItems: ContentItem[] = action.payload.map(article => ({
          id: `news-${encodeURIComponent(article.url)}`,
          type: 'news',
          title: article.title,
          description: article.description,
          image: article.urlToImage,
          url: article.url,
          author: article.author,
          publishedAt: article.publishedAt,
          category: article.category || 'general',
          rating: Math.random() * 2 + 5, // Mock rating 7-10
        }))
        state.items = [...state.items.filter(item => item.type !== 'news'), ...newsItems]
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch news'
      })

    // Movies
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMovies.fulfilled, (state, action: PayloadAction<MovieResult[]>) => {
        state.loading = false
        const movieItems: ContentItem[] = action.payload.map(movie => ({
          id: `movie-${movie.id}`,
          type: 'movie',
          title: movie.title,
          description: movie.overview,
          image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined,
          publishedAt: movie.release_date,
          category: 'movies',
          rating: movie.vote_average,
        }))
        state.items = [...state.items.filter(item => item.type !== 'movie'), ...movieItems]
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch movies'
      })

    // Social
    builder
      .addCase(fetchSocialPosts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSocialPosts.fulfilled, (state, action: PayloadAction<SocialPost[]>) => {
        state.loading = false
        const socialItems: ContentItem[] = action.payload.map(post => ({
          id: `social-${post.id}`,
          type: 'social',
          title: post.username,
          description: post.caption,
          image: post.image,
          author: post.username,
          publishedAt: post.createdAt,
          category: 'social',
          rating: Math.random() * 2 + 5, // Mock rating 8-10
        }))
        state.items = [...state.items.filter(item => item.type !== 'social'), ...socialItems]
      })
      .addCase(fetchSocialPosts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch social posts'
      })
  },
})

export const {
  setSearchQuery,
  setSearchResults,
  reorderItems,
  clearError,
  updateTrending,
} = contentSlice.actions

export default contentSlice.reducer
