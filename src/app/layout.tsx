'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { Provider, useSelector } from 'react-redux'
import { store, RootState } from '@/store'
import Layout from '@/components/Layout'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

// ThemeWrapper jo Provider ke andar use hoga
function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const darkMode = useSelector((state: RootState) => state.preferences.darkMode)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={mounted ? (darkMode ? 'dark' : 'bg-black text-white') : ''}>
      {children}
    </div>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Provider store={store}>
          <ThemeWrapper>
            <Layout>{children}</Layout>
          </ThemeWrapper>
        </Provider>
      </body>
    </html>
  )
}
