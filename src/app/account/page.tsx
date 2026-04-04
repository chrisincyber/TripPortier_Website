'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { LogOut, Mail, Loader2, MapPin, Plane, Wifi, Settings } from 'lucide-react'
import Link from 'next/link'

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setError('')
    setMessage('')

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setMessage('Check your email for a confirmation link.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    }
    setAuthLoading(false)
  }

  const handleOAuth = async (provider: 'google' | 'apple') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
      </div>
    )
  }

  // Logged in view
  if (user) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">Your Account</h1>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link href="/trips" className="group p-5 rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all">
            <Plane className="w-5 h-5 text-indigo-500 mb-2" />
            <h3 className="font-display font-bold text-slate-900 text-sm">My Trips</h3>
            <p className="text-xs text-slate-500 mt-1">View and manage your trips</p>
          </Link>
          <Link href="/myesims" className="group p-5 rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all">
            <Wifi className="w-5 h-5 text-indigo-500 mb-2" />
            <h3 className="font-display font-bold text-slate-900 text-sm">My eSIMs</h3>
            <p className="text-xs text-slate-500 mt-1">View purchased eSIM plans</p>
          </Link>
          <Link href="/premium" className="group p-5 rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all">
            <MapPin className="w-5 h-5 text-indigo-500 mb-2" />
            <h3 className="font-display font-bold text-slate-900 text-sm">Subscription</h3>
            <p className="text-xs text-slate-500 mt-1">Manage TripPortier+</p>
          </Link>
          <Link href="/settings" className="group p-5 rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all">
            <Settings className="w-5 h-5 text-indigo-500 mb-2" />
            <h3 className="font-display font-bold text-slate-900 text-sm">Settings</h3>
            <p className="text-xs text-slate-500 mt-1">Profile, notifications, passport</p>
          </Link>
        </div>

        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    )
  }

  // Auth form
  return (
    <div className="max-w-sm mx-auto px-4 py-20 sm:py-28">
      <div className="text-center mb-8">
        <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="text-sm text-slate-500">
          {isSignUp ? 'Start planning your next adventure' : 'Sign in to your TripPortier account'}
        </p>
      </div>

      {/* OAuth */}
      <div className="space-y-2 mb-6">
        <button
          onClick={() => handleOAuth('google')}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>
        <button
          onClick={() => handleOAuth('apple')}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
          Continue with Apple
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400">or</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Email form */}
      <form onSubmit={handleEmailAuth} className="space-y-3">
        {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">{error}</p>}
        {message && <p className="text-sm text-emerald-600 bg-emerald-50 p-2 rounded-lg">{message}</p>}

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            placeholder="Min. 8 characters"
          />
        </div>

        <button
          type="submit"
          disabled={authLoading}
          className="w-full py-2.5 bg-indigo-600 text-white font-medium text-sm rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {authLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : isSignUp ? 'Create Account' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500 mt-4">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button onClick={() => { setIsSignUp(!isSignUp); setError(''); setMessage('') }} className="text-indigo-600 font-medium">
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </div>
  )
}
