'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiTrendingUp } from 'react-icons/fi'
import { FaFire } from 'react-icons/fa'
import { RootState, AppDispatch } from '@/store'
import { 
  fetchNews, 
  fetchMovies, 
  fetchSocialPosts, 
  updateTrending 
} from '@/store/slices/contentSlice'
import ContentCard from '@/components/ContentCard'

export default function Trending() {
  const dispatch = useDispatch<AppDispatch>()
  const { trendingItems, items } = useSelector((state: RootState) => state.content)

  // Fetch all content types on mount
  useEffect(() => {
    dispatch(fetchNews('general'))
    dispatch(fetchMovies())
    dispatch(fetchSocialPosts())
  }, [dispatch])

  // Update trending whenever items change
  useEffect(() => {
    if (items.length > 0) {
      dispatch(updateTrending())
    }
  }, [items, dispatch])

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
          <FiTrendingUp className="text-orange-500" />
          <span>Trending</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          {trendingItems.length > 0 
            ? "Hot content that's making waves right now"
            : 'Check back soon for trending content'}
        </p>
      </motion.div>

      {/* Trending Badge */}
      {trendingItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-8"
        >
          <FaFire size={16} />
          <span>Top {trendingItems.length} Trending Items</span>
        </motion.div>
      )}

      {/* Content */}
      {trendingItems.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {trendingItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Trending Rank */}
              <div className="absolute -top-2 -left-2 z-10 w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                {index + 1}
              </div>
              <ContentCard item={item} index={index} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
            <FiTrendingUp className="text-orange-500" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No trending content yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            Trending content will appear here based on ratings and recency. 
            Check back after more content is loaded.
          </p>
        </motion.div>
      )}
    </div>
  )
}
