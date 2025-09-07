'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiHeart, FiExternalLink, FiPlay, FiUser, FiCalendar, FiStar } from 'react-icons/fi'
import { RootState } from '@/store'
import { addToFavorites, removeFromFavorites } from '@/store/slices/preferencesSlice'
import { ContentItem } from '@/store/slices/contentSlice'

interface ContentCardProps {
  item: ContentItem
  index: number
}

export default function ContentCard({ item, index }: ContentCardProps) {
  const dispatch = useDispatch()
  const { favorites } = useSelector((state: RootState) => state.preferences)
  const [imageError, setImageError] = useState(false)
  
  const isFavorite = favorites.includes(item.id)

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(item.id))
    } else {
      dispatch(addToFavorites(item.id))
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getTypeColor = () => {
    switch (item.type) {
      case 'news': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'movie': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
      case 'social': return 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getActionIcon = () => {
    switch (item.type) {
      case 'news': return <FiExternalLink size={16} />
      case 'movie': return <FiPlay size={16} />
      case 'social': return <FiUser size={16} />
      default: return <FiExternalLink size={16} />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 group"
    >
      {/* Image */}
      {item.image && !imageError && (
        <div className="relative aspect-video overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Type Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor()}`}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </span>
          </div>

          {/* Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavoriteToggle}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
          >
            <FiHeart
              size={16}
              className={isFavorite ? 'text-red-500 fill-red-500' : 'text-white'}
            />
          </motion.button>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight">
          {item.title}
        </h3>
        
        {item.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
            {item.description}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-4">
            {item.author && (
              <div className="flex items-center space-x-1">
                <FiUser size={12} />
                <span>{item.author}</span>
              </div>
            )}
            {item.publishedAt && (
              <div className="flex items-center space-x-1">
                <FiCalendar size={12} />
                <span>{formatDate(item.publishedAt)}</span>
              </div>
            )}
          </div>
          {item.rating && (
            <div className="flex items-center space-x-1">
              <FiStar className="text-yellow-500" size={12} />
              <span>{item.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => item.url && window.open(item.url, '_blank')}
            disabled={!item.url && item.type !== 'social'}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
          >
            {getActionIcon()}
            <span>
              {item.type === 'news' ? 'Read More' : 
               item.type === 'movie' ? 'Watch Trailer' : 'View Post'}
            </span>
          </motion.button>

          {!item.image && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleFavoriteToggle}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FiHeart
                size={18}
                className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}
              />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}