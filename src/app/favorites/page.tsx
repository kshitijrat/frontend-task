'use client'

import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiHeart } from 'react-icons/fi'
import { RootState } from '@/store'
import ContentCard from '@/components/ContentCard'

export default function Favorites() {
  const { favorites } = useSelector((state: RootState) => state.preferences)
  const { items } = useSelector((state: RootState) => state.content)

  const favoriteItems = items.filter(item => favorites.includes(item.id))

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold flex items-center space-x-3">
          <FiHeart className="text-red-500" />
          <span>Favorites</span>
        </h1>
        <p className=" mt-2">
          {favoriteItems.length > 0 
            ? `You have ${favoriteItems.length} favorite item${favoriteItems.length !== 1 ? 's' : ''}`
            : 'Save your favorite content to see it here'}
        </p>
      </motion.div>

      {/* Content */}
      {favoriteItems.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {favoriteItems.map((item, index) => (
            <ContentCard key={item.id} item={item} index={index} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <FiHeart className="text-red-500" size={32} />
          </div>
          <h3 className="text-xl font-semibold  mb-2">
            No favorites yet
          </h3>
          <p className=" max-w-md mx-auto">
            Start adding content to your favorites by clicking the heart icon on any post. 
            They'll appear here for easy access later.
          </p>
        </motion.div>
      )}
    </div>
  )
}