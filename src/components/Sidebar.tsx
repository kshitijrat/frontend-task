'use client'

import { useSelector } from 'react-redux'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  FiHome, 
  FiTrendingUp, 
  FiHeart, 
  FiSettings,
  FiRss,
  FiFilm,
  FiUsers 
} from 'react-icons/fi'
import { RootState } from '@/store'

const navigation = [
  { name: 'Feed', href: '/', icon: FiHome },
  { name: 'Trending', href: '/trending', icon: FiTrendingUp },
  { name: 'Favorites', href: '/favorites', icon: FiHeart },
  { name: 'Settings', href: '/settings', icon: FiSettings },
]

const categories = [
  { name: 'News', href: '/news', icon: FiRss },
  { name: 'Movies', href: '/movies', icon: FiFilm },
  { name: 'Social', href: '/social', icon: FiUsers },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { darkMode } = useSelector((state: RootState) => state.preferences)

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div 
        initial={{ x: -264 }}
        animate={{ x: 0 }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 hidden lg:block"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                <FiRss className="text-white" size={18} />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">SocialFeed</span>
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <motion.button
                  key={item.name}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-4 border-blue-500'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </motion.button>
              )
            })}
          </nav>

          {/* Categories */}
          <div className="px-4 pb-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Categories
            </h3>
            <div className="space-y-2">
              {categories.map((item) => {
                const isActive = pathname === item.href
                return (
                  <motion.button
                    key={item.name}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(item.href)}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <item.icon size={16} />
                    <span className="text-sm">{item.name}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}