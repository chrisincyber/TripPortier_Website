'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { ArrowLeft, Loader2, User as UserIcon, Mail, Save, Check, AlertCircle } from 'lucide-react'

interface UserProfile {
  id: string
  email?: string
  displayName?: string
  display_name?: string
  photoURL?: string
  photo_url?: string
  isPremium?: boolean
  is_premium?: boolean
  premiumExpiry?: string
  premium_expiry?: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [displayName, setDisplayName] = useState('')

  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (!user) {
        setLoading(false)
        return
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (fetchError && fetchError.code !== 'PGRST116') throw fetchError

        if (data) {
          setProfile(data)
          setDisplayName(data.displayName || data.display_name || '')
        } else {
          setDisplayName(user.user_metadata?.full_name || user.user_metadata?.name || '')
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load profile'
        setError(message)
      }
      setLoading(false)
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setError('')
    setSaved(false)

    try {
      const { error: upsertError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          displayName: displayName.trim(),
          display_name: displayName.trim(),
        }, { onConflict: 'id' })

      if (upsertError) throw upsertError
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save profile'
      setError(message)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <UserIcon className="w-10 h-10 text-slate-300 mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">Sign in to view your profile</h1>
        <p className="text-sm text-slate-500 mb-6">Log in to manage your profile information.</p>
        <Link href="/account" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors">
          Go to Account
        </Link>
      </div>
    )
  }

  const isPremium = profile?.isPremium || profile?.is_premium || false
  const photoURL = profile?.photoURL || profile?.photo_url || user.user_metadata?.avatar_url

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <Link href="/account" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Account
      </Link>

      <h1 className="font-display text-3xl font-bold text-slate-900 mb-8">Profile</h1>

      {/* Avatar and name */}
      <div className="flex items-center gap-4 mb-8">
        {photoURL ? (
          <img src={photoURL} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-slate-200" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
            <UserIcon className="w-7 h-7 text-indigo-500" />
          </div>
        )}
        <div>
          <h2 className="font-display font-bold text-slate-900">
            {displayName || user.email?.split('@')[0] || 'Traveler'}
          </h2>
          {isPremium && (
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              TripPortier+
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700 mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="space-y-5">
        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
          />
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              value={user.email || ''}
              readOnly
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">Email is managed through your auth provider</p>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
