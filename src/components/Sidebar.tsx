'use client'

import { motion } from 'framer-motion'
import {
  FiHome,
  FiTrendingUp,
  FiHeart,
  FiSettings,
  FiRss,
  FiFilm,
  FiUsers,
  FiUser,
  FiLogIn,
} from 'react-icons/fi'
import { useRouter, usePathname } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { logout } from '@/store/slices/authSlice'
import { clearFavoritesOnLogout, setCurrentUserEmail } from '@/store/slices/preferencesSlice'

const categories = [
  { name: 'News', href: '/news', icon: FiRss },
  { name: 'Movies', href: '/movies', icon: FiFilm },
  { name: 'Social', href: '/social', icon: FiUsers },
]

export default function Sidebar({
  showMobileMenu,
  setShowMobileMenu,
}: {
  showMobileMenu: boolean
  setShowMobileMenu: (value: boolean) => void
}) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <>
      <motion.div
        initial={{ x: -264 }}
        animate={{ x: 0 }}
        className="fixed inset-y-0 left-0 z-50 w-64 hidden lg:block border-r"
      >
        <SidebarContent router={router} pathname={pathname} />
      </motion.div>

      <motion.div
        initial={{ x: -264 }}
        animate={{ x: showMobileMenu ? 0 : -264 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden border-r"
      >
        <SidebarContent router={router} pathname={pathname} />
      </motion.div>

      {showMobileMenu && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/30"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </>
  )
}

function SidebarContent({
  router,
  pathname,
}: {
  router: ReturnType<typeof useRouter>
  pathname: string
}) {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearFavoritesOnLogout())
    dispatch(setCurrentUserEmail(null))
    router.push('/login')
  }

  const handleNavigation = (href: string) => {
    if (!user) {
      localStorage.setItem('sf_redirect', href)
      router.push('/login')
    } else {
      router.push(href)
    }
  }

  const navigation = [
    { name: 'Feed', href: '/', icon: FiHome },
    { name: 'Trending', href: '/trending', icon: FiTrendingUp },
    { name: 'Favorites', href: '/favorites', icon: FiHeart },
    { name: 'Settings', href: '/settings', icon: FiSettings },
    ...(!user ? [{ name: 'Login/Signup', href: '/login', icon: FiLogIn }] : []),
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <div
          className="flex items-center cursor-pointer space-x-3"
          onClick={() => handleNavigation('/')}
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
            <FiRss className="text-white" size={18} />
          </div>
          <span className="text-xl font-bold">SocialFeed</span>
        </div>
      </div>

      <div className="px-6 mb-6">
        <div className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
            <FiUser className="text-white" size={18} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">{user?.name ?? 'Guest'}</div>
            <div className="text-xs truncate">{user?.email ?? 'guest@example.com'}</div>
          </div>
          {user && (
            <button
              onClick={handleLogout}
              className="px-2 py-1 text-xs text-red-600 border rounded hover:bg-red-50"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <motion.button
              key={item.name}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNavigation(item.href)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 
                ${isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-4 border-blue-500'
                  : 'hover:border-b'
                }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </motion.button>
          )
        })}
      </nav>

      <div className="px-4 pb-6">
        <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">
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
                onClick={() => handleNavigation(item.href)}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-all duration-200 
                  ${isActive
                    ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'
                    : 'hover:border-b'
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
  )
}
