'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { RootState, AppDispatch } from '@/store'
import { loginUser, signupUser, clearError } from '@/store/slices/authSlice'
import { setCurrentUserEmail } from '@/store/slices/preferencesSlice'

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const { isAuthenticated, loading, error, user } = useSelector((state: RootState) => state.auth)

  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      dispatch(setCurrentUserEmail(user.email))

      // if guest user clicked a favorite before logging in, redirect
      const redirect = typeof window !== 'undefined' ? localStorage.getItem('sf_redirect') || '/' : '/'
      if (typeof window !== 'undefined') localStorage.removeItem('sf_redirect')

      router.push(redirect)
    }
  }, [isAuthenticated, user, dispatch, router])

  // clear erro 
  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (isLogin) {
      // existing user login
      const res = await dispatch(loginUser({ email, password }))
      if (loginUser.rejected.match(res)) {
        setLocalError((res.payload as string) || res.error?.message || 'Login failed')
      }
    } else {
      // new user signup
      if (!name.trim()) {
        setLocalError('Please enter a name')
        return
      }

      const res = await dispatch(signupUser({ name, email, password }))
      if (signupUser.rejected.match(res)) {
        setLocalError((res.payload as string) || res.error?.message || 'Signup failed')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center border border-gray-300 rounded-2xl p-8 shadow-lg bg-white">
        <h1 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Sign Up'}</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {!isLogin && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="px-4 py-2 rounded-lg border focus:outline-none focus:ring focus:ring-blue-300"
              required={!isLogin}
            />
          )}

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="px-4 py-2 rounded-lg border focus:outline-none focus:ring focus:ring-blue-300"
            required
            type="email"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="px-4 py-2 rounded-lg border focus:outline-none focus:ring focus:ring-blue-300"
            required
            type="password"
          />

          <button
            type="submit"
            className="py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:opacity-90 transition"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Create account')}
          </button>
        </form>

        {/* error */}
        {(localError || error) && (
          <p className="mt-3 text-sm text-red-600">{localError || error}</p>
        )}

        {/* login and sign up */}
        <p className="text-sm mt-4">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setLocalError(null)
            }}
            className="text-blue-500 font-semibold hover:underline"
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}
