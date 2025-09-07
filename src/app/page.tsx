'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiRefreshCw } from 'react-icons/fi'
import { RootState } from '@/store'
import { 
  fetchNews, 
  fetchMovies, 
  fetchSocialPosts, 
  updateTrending,
  ContentItem 
} from '@/store/slices/contentSlice'
import ContentCard from '@/components/ContentCard'
import { AppDispatch } from '@/store'

export default function Home() {
  
  const dispatch = useDispatch<AppDispatch>()
  const { items, loading, error, searchQuery, searchResults } = useSelector((state: RootState) => state.content)
  const { categories } = useSelector((state: RootState) => state.preferences)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadContent()
  }, [categories])

  const loadContent = async () => {
    setRefreshing(true)
    try {
      // Fetch content based on user preferences
      await Promise.all([
        dispatch(fetchNews(categories.includes('Technology') ? 'technology' : 'general')),
        dispatch(fetchMovies()),
        dispatch(fetchSocialPosts())
      ])
      dispatch(updateTrending())
    } finally {
      setRefreshing(false)
    }
  }

  const displayItems = searchQuery.trim() ? searchResults : items

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-gray-900 dark:text-white"
          >
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Your Feed'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 dark:text-gray-300 mt-1"
          >
            {searchQuery ? `${displayItems.length} results found` : 'Latest news, movies, and social content'}
          </motion.p>
        </div>

        {!searchQuery && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadContent}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <FiRefreshCw className={refreshing ? 'animate-spin' : ''} size={16} />
            <span>Refresh</span>
          </motion.button>
        )}
      </div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
        >
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </motion.div>
      )}

      {/* Content Grid */}
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
          className="text-center py-12"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <FiRefreshCw className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {searchQuery ? 'No results found' : 'No content available'}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {searchQuery 
              ? 'Try adjusting your search terms' 
              : 'Click refresh to load content'}
          </p>
          {!searchQuery && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadContent}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Load Content
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  )
}