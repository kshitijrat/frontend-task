'use client'

import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiRefreshCw } from 'react-icons/fi'
import { RootState } from '@/store'
import { 
  fetchNews, 
  fetchMovies, 
  fetchSocialPosts, 
  updateTrending,
} from '@/store/slices/contentSlice'
import ContentCard from '@/components/ContentCard'
import { AppDispatch } from '@/store'

export default function Home() {
  const dispatch = useDispatch<AppDispatch>()
  const { items, loading, error, searchQuery, searchResults } = useSelector((state: RootState) => state.content)
  const { categories } = useSelector((state: RootState) => state.preferences)
  const [refreshing, setRefreshing] = useState(false)

  // automatically fetch content when page loads or categories change
  const loadContent = useCallback(async () => {
    setRefreshing(true)
    try {
      await Promise.all([
        dispatch(fetchNews(categories.includes('Technology') ? 'technology' : 'general')),
        dispatch(fetchMovies()),
        dispatch(fetchSocialPosts())
      ])
      dispatch(updateTrending())
    } finally {
      setRefreshing(false)
    }
  }, [categories, dispatch])

  // run on first page load and whenever `categories` changes
  useEffect(() => {
    loadContent()
  }, [loadContent])

  const displayItems = searchQuery.trim() ? searchResults : items

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div className="mb-4 md:mb-0">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold"
          >
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Your Feed'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-1"
          >
            {searchQuery ? `${displayItems.length} results found` : 'Latest news, movies, and social content'}
          </motion.p>
        </div>
      </div>

      {/* error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
        >
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </motion.div>
      )}

      {/* content Grid */}
      {displayItems.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayItems.map((item, index) => (
            <ContentCard key={item.id} item={item} index={index} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center">
            <FiRefreshCw className="text-gray-400" size={28} />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {searchQuery ? 'No results found' : 'No content available'}
          </h3>
          <p className="mb-4">
            {searchQuery 
              ? 'Try adjusting your search terms' 
              : 'Content will load automatically'}
          </p>
        </motion.div>
      )}
    </div>
  )
}
