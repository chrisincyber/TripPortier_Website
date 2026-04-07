'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Settings, Bell, LogOut, Trash2, AlertTriangle, Shield } from 'lucide-react'
import { sanitizeError } from '@/lib/sanitize-error'

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [notifications, setNotifications] = useState({
    tripReminders: true,
    esimAlerts: true,
    promotions: false,
  })

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/account')
  }

  const handleDeleteAccount = async () => {
    if (!user) return
    setDeleting(true)
    setDeleteError('')

    try {
      // Delete user data from users table
      await supabase.from('users').delete().eq('id', user.id)

      // Sign out
      await supabase.auth.signOut()
      router.push('/account')
    } catch (err: unknown) {
      setDeleteError(sanitizeError(err, 'Failed to delete account. Please contact support.'))
      setDeleting(false)
    }
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
        <Settings className="w-10 h-10 text-slate-300 mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">Sign in to access settings</h1>
        <p className="text-sm text-slate-500 mb-6">You need to be logged in to manage your settings.</p>
        <Link href="/account" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors">
          Go to Account
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <Link href="/account" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Account
      </Link>

      <h1 className="font-display text-3xl font-bold text-slate-900 mb-8">Settings</h1>

      {/* Notifications */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-indigo-500" />
          <h2 className="font-display text-lg font-bold text-slate-900">Notifications</h2>
        </div>

        <div className="space-y-3">
          <NotificationToggle
            label="Trip Reminders"
            description="Get notified about upcoming trips and packing reminders"
            checked={notifications.tripReminders}
            onChange={(v) => setNotifications(prev => ({ ...prev, tripReminders: v }))}
          />
          <NotificationToggle
            label="eSIM Alerts"
            description="Data usage alerts and expiration warnings"
            checked={notifications.esimAlerts}
            onChange={(v) => setNotifications(prev => ({ ...prev, esimAlerts: v }))}
          />
          <NotificationToggle
            label="Promotions"
            description="Deals, discounts, and new destination updates"
            checked={notifications.promotions}
            onChange={(v) => setNotifications(prev => ({ ...prev, promotions: v }))}
          />
        </div>
      </section>

      {/* Account info */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-indigo-500" />
          <h2 className="font-display text-lg font-bold text-slate-900">Account</h2>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Email</span>
            <span className="text-sm font-medium text-slate-900">{user.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Auth Provider</span>
            <span className="text-sm font-medium text-slate-900 capitalize">
              {user.app_metadata?.provider || 'Email'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Account Created</span>
            <span className="text-sm font-medium text-slate-900">
              {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
            </span>
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="space-y-3">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left"
        >
          <LogOut className="w-5 h-5 text-slate-500" />
          <div>
            <p className="text-sm font-medium text-slate-900">Sign Out</p>
            <p className="text-xs text-slate-500">Sign out of your account on this device</p>
          </div>
        </button>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full flex items-center gap-3 p-4 rounded-xl border border-red-100 hover:border-red-200 hover:bg-red-50/50 transition-all text-left"
        >
          <Trash2 className="w-5 h-5 text-red-500" />
          <div>
            <p className="text-sm font-medium text-red-700">Delete Account</p>
            <p className="text-xs text-red-400">Permanently delete your account and all data</p>
          </div>
        </button>
      </section>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 mb-2">Delete Account?</h3>
              <p className="text-sm text-slate-500 mb-6">
                This will permanently delete your account, trips, and all associated data. This action cannot be undone.
              </p>

              {deleteError && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4">{deleteError}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function NotificationToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? 'bg-indigo-600' : 'bg-slate-200'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}
