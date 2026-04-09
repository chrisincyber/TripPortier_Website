'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { ArrowLeft, Loader2, Wifi, Globe, Clock, AlertCircle } from 'lucide-react'
import { sanitizeError } from '@/lib/sanitize-error'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!

interface EsimOrder {
  id: string
  countryCode?: string
  countryTitle?: string
  packageName?: string
  data?: string
  days?: number
  validityDays?: number
  price?: number
  amountPaid?: number
  esimStatus?: string
  isUnlimited?: boolean
  dataRemaining?: string
  createdAt?: string | { seconds: number }
  orderedAt?: string | { seconds: number }
  created_at?: string
}

function getFlag(code: string): string {
  if (!code) return ''
  const c = code.toUpperCase()
  return String.fromCodePoint(...[...c].map(ch => 0x1f1e6 + ch.charCodeAt(0) - 65))
}

function getOrderDate(order: EsimOrder): Date {
  if (order.created_at) return new Date(order.created_at)
  if (typeof order.createdAt === 'string') return new Date(order.createdAt)
  if (order.createdAt && typeof order.createdAt === 'object' && 'seconds' in order.createdAt) {
    return new Date(order.createdAt.seconds * 1000)
  }
  if (typeof order.orderedAt === 'string') return new Date(order.orderedAt)
  if (order.orderedAt && typeof order.orderedAt === 'object' && 'seconds' in order.orderedAt) {
    return new Date(order.orderedAt.seconds * 1000)
  }
  return new Date()
}

function getStatusDisplay(status: string): { label: string; color: string } {
  const s = (status || '').toLowerCase()
  if (s.includes('active') || s.includes('in_use')) return { label: 'Active', color: 'bg-emerald-50 text-emerald-700' }
  if (s.includes('installed')) return { label: 'Installed', color: 'bg-blue-50 text-blue-700' }
  if (s.includes('not_installed') || s.includes('pending')) return { label: 'Pending', color: 'bg-amber-50 text-amber-700' }
  if (s.includes('expired')) return { label: 'Expired', color: 'bg-slate-100 text-slate-500' }
  if (s.includes('depleted')) return { label: 'Used Up', color: 'bg-slate-100 text-slate-500' }
  return { label: status || 'Unknown', color: 'bg-slate-100 text-slate-500' }
}

const ACTIVE_STATUSES = ['active', 'in_use', 'installed', 'not_installed', 'pending']
const PAST_STATUSES = ['expired', 'depleted']

function isActiveOrder(order: EsimOrder): boolean {
  const status = (order.esimStatus || '').toLowerCase()
  if (status) return ACTIVE_STATUSES.some(s => status.includes(s))
  const days = order.days || order.validityDays || 30
  const created = getOrderDate(order)
  const expiry = new Date(created.getTime() + days * 86400000)
  return expiry > new Date()
}

export default function MyEsimsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<EsimOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'active' | 'history'>('active')

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
        const { data: { session } } = await supabase.auth.getSession()
        const res = await fetch(`${SUPABASE_URL}/functions/v1/get-user-esim-orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token || ''}`,
          },
          body: JSON.stringify({}),
        })
        const data = await res.json()
        if (data?.success && data.orders) {
          setOrders(data.orders)
        } else {
          setOrders([])
        }
      } catch (err: unknown) {
        setError(sanitizeError(err, 'Failed to load eSIM orders.'))
      }
      setLoading(false)
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const activeOrders = orders.filter(isActiveOrder)
  const pastOrders = orders.filter(o => !isActiveOrder(o))
  const displayedOrders = tab === 'active' ? activeOrders : pastOrders

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="h-5 w-24 bg-slate-100 rounded mb-6 animate-pulse" />
        <div className="h-8 w-40 bg-slate-200 rounded mb-2 animate-pulse" />
        <div className="h-4 w-28 bg-slate-100 rounded mb-8 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-5 rounded-2xl border border-slate-100 animate-pulse">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-200 rounded" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-20 bg-slate-200 rounded" />
                    <div className="h-3 w-28 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="h-5 w-14 bg-slate-100 rounded-full" />
              </div>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                <div className="h-8 bg-slate-100 rounded" />
                <div className="h-8 bg-slate-100 rounded" />
                <div className="h-8 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <Wifi className="w-10 h-10 text-slate-300 mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">Your eSIMs, all in one place</h1>
        <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">Sign in to track your eSIM plans, view activation status, and earn TripCoins on every purchase.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link href="/account" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors">
            Sign In
          </Link>
          <Link href="/esim" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors">
            Browse eSIM Plans
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-md sm:max-w-none mx-auto">
          {[
            { label: 'Track all your eSIMs', desc: 'See status, data remaining, and expiry' },
            { label: 'Earn TripCoins', desc: 'Up to 10% cashback on every purchase' },
            { label: 'Instant reorder', desc: 'Buy the same plan again in one tap' },
          ].map(({ label, desc }) => (
            <div key={label} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-left">
              <p className="text-xs font-semibold text-slate-900">{label}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <Link href="/account" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Account
      </Link>

      <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">My eSIMs</h1>
      <p className="text-sm text-slate-500 mb-6">{orders.length} eSIM order{orders.length !== 1 ? 's' : ''}</p>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700 mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <Wifi className="w-7 h-7 text-indigo-400" />
          </div>
          <h2 className="font-display text-xl font-bold text-slate-900 mb-2">Ready for your next trip?</h2>
          <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
            Get an eSIM and stay connected the moment you land. No SIM swapping needed.
          </p>
          <Link href="/esim" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors">
            <Globe className="w-4 h-4" />
            Browse eSIM Plans
          </Link>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setTab('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === 'active' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Active ({activeOrders.length})
            </button>
            <button
              onClick={() => setTab('history')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === 'history' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              History ({pastOrders.length})
            </button>
          </div>

          {displayedOrders.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm text-slate-500">
                {tab === 'active' ? 'No active eSIMs. Your active plans will appear here.' : 'No expired eSIMs yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedOrders.map(order => (
                <EsimCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function EsimCard({ order }: { order: EsimOrder }) {
  const flag = getFlag(order.countryCode || '')
  const country = order.countryTitle || 'eSIM'
  const packageName = order.packageName || `${order.data || ''} - ${order.days || order.validityDays || ''} Days`
  const price = order.price || (order.amountPaid ? order.amountPaid / 100 : 0)
  const status = getStatusDisplay(order.esimStatus || '')
  const dataInfo = order.isUnlimited ? 'Unlimited' : order.dataRemaining || order.data || '-'
  const date = getOrderDate(order)
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{flag}</span>
          <div>
            <h3 className="font-display font-bold text-slate-900 text-sm">{country}</h3>
            <p className="text-xs text-slate-500">{packageName}</p>
          </div>
        </div>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${status.color}`}>
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center pt-3 border-t border-slate-100">
        <div>
          <p className="text-[11px] text-slate-400 mb-0.5">Data</p>
          <p className="text-xs font-medium text-slate-700">{dataInfo}</p>
        </div>
        <div>
          <p className="text-[11px] text-slate-400 mb-0.5">Validity</p>
          <p className="text-xs font-medium text-slate-700">{order.validityDays || order.days || '-'} days</p>
        </div>
        <div>
          <p className="text-[11px] text-slate-400 mb-0.5">Price</p>
          <p className="text-xs font-medium text-slate-700">${price.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-3 text-[11px] text-slate-400">
        <Clock className="w-3 h-3" />
        Purchased {dateStr}
      </div>
    </div>
  )
}
