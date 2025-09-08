/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store'
import { initializeAuth } from '@/store/slices/authSlice'
import { setCurrentUserEmail } from '@/store/slices/preferencesSlice'
import Header from './Header'
import Sidebar from './Sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const { darkMode } = useSelector((state: RootState) => state.preferences)
  const authUser = useSelector((state: RootState) => state.auth.user)

  useEffect(() => {
    dispatch(initializeAuth() as any) // initialize auth state
  }, [dispatch])

  useEffect(() => {
  if (authUser?.email) {
    dispatch(setCurrentUserEmail(authUser.email))
  } else {
    // if no logged-in user, ensure preferences cleared
    dispatch(setCurrentUserEmail(null))
  }
}, [authUser, dispatch])
  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'dark: bg-black text-white' : 'bg-white text-black'
      }`}
    >
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
        />

        {/* Main Content */}
        <div className="flex-1 ml-0 lg:ml-64">
          <Header
            showMobileMenu={showMobileMenu}
            setShowMobileMenu={setShowMobileMenu}
          />
          <main className="pt-16 px-4 lg:px-8 py-6">
            <ProtectedRoute>{children}</ProtectedRoute>
          </main>
        </div>
      </div>
    </div>
  )
}
