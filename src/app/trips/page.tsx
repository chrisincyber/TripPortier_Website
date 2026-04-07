'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { ArrowLeft, Loader2, Plane, MapPin, Calendar, Plus, Clock } from 'lucide-react'

interface Trip {
  id: string
  user_id: string
  name: string
  destination: string
  destinationDisplay?: string
  startDate: string | null
  endDate: string | null
  status: string
  countryCode?: string
  isSomedayTrip?: boolean
  latitude?: number
  longitude?: number
  created_at?: string
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getTripStatus(trip: Trip): { label: string; color: string } {
  if (trip.status === 'completed' || trip.status === 'past') {
    return { label: 'Completed', color: 'bg-slate-100 text-slate-600' }
  }
  if (trip.isSomedayTrip) {
    return { label: 'Wishlist', color: 'bg-amber-50 text-amber-700' }
  }
  if (trip.startDate && trip.endDate) {
    const now = new Date()
    const start = new Date(trip.startDate)
    const end = new Date(trip.endDate)
    if (now >= start && now <= end) {
      return { label: 'Active', color: 'bg-emerald-50 text-emerald-700' }
    }
    if (now < start) {
      return { label: 'Upcoming', color: 'bg-indigo-50 text-indigo-700' }
    }
    if (now > end) {
      return { label: 'Completed', color: 'bg-slate-100 text-slate-600' }
    }
  }
  return { label: trip.status || 'Planned', color: 'bg-slate-100 text-slate-600' }
}

export default function TripsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
          .from('trips')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError
        setTrips(data || [])
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load trips'
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
        <Plane className="w-10 h-10 text-slate-300 mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">Sign in to view your trips</h1>
        <p className="text-sm text-slate-500 mb-6">You need to be logged in to see your trips.</p>
        <Link href="/account" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors">
          Go to Account
        </Link>
      </div>
    )
  }

  const activeTrips = trips.filter(t => {
    const s = getTripStatus(t)
    return s.label === 'Active'
  })
  const upcomingTrips = trips.filter(t => {
    const s = getTripStatus(t)
    return s.label === 'Upcoming'
  })
  const wishlistTrips = trips.filter(t => {
    const s = getTripStatus(t)
    return s.label === 'Wishlist'
  })
  const pastTrips = trips.filter(t => {
    const s = getTripStatus(t)
    return s.label === 'Completed'
  })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <Link href="/account" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Account
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">My Trips</h1>
          <p className="text-sm text-slate-500 mt-1">{trips.length} trip{trips.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700 mb-6">{error}</div>
      )}

      {trips.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <Plane className="w-7 h-7 text-indigo-400" />
          </div>
          <h2 className="font-display text-xl font-bold text-slate-900 mb-2">No trips yet</h2>
          <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
            Plan your next adventure using the TripPortier app. Your trips will appear here.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 text-sm rounded-xl">
            <Plus className="w-4 h-4" />
            Create trips in the TripPortier app
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {activeTrips.length > 0 && (
            <TripSection title="Active Now" trips={activeTrips} />
          )}
          {upcomingTrips.length > 0 && (
            <TripSection title="Upcoming" trips={upcomingTrips} />
          )}
          {wishlistTrips.length > 0 && (
            <TripSection title="Wishlist" trips={wishlistTrips} />
          )}
          {pastTrips.length > 0 && (
            <TripSection title="Past Trips" trips={pastTrips} />
          )}
        </div>
      )}
    </div>
  )
}

function TripSection({ title, trips }: { title: string; trips: Trip[] }) {
  return (
    <div>
      <h2 className="font-display text-lg font-bold text-slate-900 mb-3">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trips.map(trip => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  )
}

function TripCard({ trip }: { trip: Trip }) {
  const status = getTripStatus(trip)
  const displayName = trip.destinationDisplay || trip.destination || trip.name || 'Untitled Trip'

  return (
    <Link
      href={`/trips/${trip.id}`}
      className="block p-5 rounded-2xl border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-indigo-500" />
          <h3 className="font-display font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
            {displayName}
          </h3>
        </div>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${status.color}`}>
          {status.label}
        </span>
      </div>

      {trip.name && trip.name !== displayName && (
        <p className="text-xs text-slate-500 mb-2">{trip.name}</p>
      )}

      {trip.startDate && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(trip.startDate)}
          {trip.endDate && <> - {formatDate(trip.endDate)}</>}
        </div>
      )}
      {trip.isSomedayTrip && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          Someday trip
        </div>
      )}
    </Link>
  )
}
