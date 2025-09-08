'use client'

import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { loadFromStorage } from '@/store/slices/preferencesSlice'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadFromStorage())
  }, [dispatch])

  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="flex">
         <Sidebar showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} />
        <div className="flex-1 ml-0 lg:ml-64">
           <Header showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} />
          <main className="pt-16 px-4 lg:px-8 py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
