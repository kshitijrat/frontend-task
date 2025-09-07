'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiSearch, FiMoon, FiSun, FiUser, FiMenu, FiX } from 'react-icons/fi'
import { RootState } from '@/store'
import { toggleDarkMode } from '@/store/slices/preferencesSlice'
import { setSearchQuery, setSearchResults } from '@/store/slices/contentSlice'
import { useDebounce } from '@/hooks/useDebounce'

export default function Header() {
  const dispatch = useDispatch()
  const { darkMode } = useSelector((state: RootState) => state.preferences)
  const { items, searchQuery } = useSelector((state: RootState) => state.content)
  const [localSearch, setLocalSearch] = useState('')
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const debouncedSearch = useDebounce(localSearch, 300)

  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearch))
    
    if (debouncedSearch.trim()) {
      const results = items.filter(item =>
        item.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.author?.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
      dispatch(setSearchResults(results))
    } else {
      dispatch(setSearchResults([]))
    }
  }, [debouncedSearch, items, dispatch])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 right-0 left-0 lg:left-64 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between px-4 lg:px-8 h-16">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {showMobileMenu ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search across all content..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-3">
          {/* Dark Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(toggleDarkMode())}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? (
              <FiSun className="text-yellow-500" size={18} />
            ) : (
              <FiMoon className="text-gray-600" size={18} />
            )}
          </motion.button>

          {/* User Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center cursor-pointer"
          >
            <FiUser className="text-white" size={16} />
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}