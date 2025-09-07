'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { loadFromStorage } from '@/store/slices/preferencesSlice'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()
  const { darkMode } = useSelector((state: RootState) => state.preferences)

  useEffect(() => {
    dispatch(loadFromStorage())
  }, [dispatch])

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-0 lg:ml-64">
          <Header />
          <main className="pt-16 px-4 lg:px-8 py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}