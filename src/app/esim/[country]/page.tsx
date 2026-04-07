'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Wifi, Clock, Globe, Loader2, Check, Phone, MessageSquare, ChevronDown } from 'lucide-react'
import { COUNTRIES } from '@/lib/countries'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bomkdhuckqosvuhfhyci.supabase.co'

interface Package {
  id: string
  title: string
  data: string
  validity: string
  price: number
  originalPrice?: number
  hasVoice?: boolean
  hasText?: boolean
  operator?: string
}

export default function EsimCountryPage() {
  const params = useParams()
  const countryCode = (params.country as string)?.toUpperCase()
  const country = COUNTRIES.find((c) => c.code === countryCode)
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'price' | 'data'>('price')

  useEffect(() => {
    if (!countryCode) return

    const fetchPackages = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/airalo-packages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'local', country: countryCode }),
        })
        const data = await res.json()
        if (data.success && data.packages) {
          setPackages(data.packages)
        } else {
          setError('No packages available for this destination.')
        }
      } catch {
        setError('Failed to load packages. Please try again.')
      }
      setLoading(false)
    }

    fetchPackages()
  }, [countryCode])

  const sorted = [...packages].sort((a, b) =>
    sortBy === 'price' ? a.price - b.price : parseInt(b.data) - parseInt(a.data)
  )

  const handleBuy = async (pkg: Package) => {
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/esim-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: pkg.id,
          countryCode,
          countryName: country?.name || countryCode,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      }
    } catch {
      alert('Failed to start checkout. Please try again.')
    }
  }

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/esim" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            All destinations
          </Link>
          <div className="flex items-center gap-4">
            {country && <span className="text-5xl">{country.flag}</span>}
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold">
                {country?.name || countryCode} eSIM Plans
              </h1>
              <p className="text-slate-400 mt-1">Instant activation - no physical SIM needed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-500">
              {loading ? 'Loading...' : `${packages.length} plans available`}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Sort by:</span>
              <button
                onClick={() => setSortBy('price')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${sortBy === 'price' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Price
              </button>
              <button
                onClick={() => setSortBy('data')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${sortBy === 'data' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Data
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
              <p className="text-sm text-slate-500">Loading eSIM plans...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-slate-500 mb-4">{error}</p>
              <Link href="/esim" className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
                Browse other destinations
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sorted.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedId(selectedId === pkg.id ? null : pkg.id)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedId === pkg.id
                      ? 'border-indigo-500 shadow-lg shadow-indigo-500/10 bg-indigo-50/30'
                      : 'border-slate-200 hover:border-indigo-200 hover:shadow-md bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display font-bold text-slate-900">{pkg.data}</h3>
                      <p className="text-xs text-slate-500">{pkg.validity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-xl font-bold text-indigo-600">${pkg.price.toFixed(2)}</p>
                      {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                        <p className="text-xs text-slate-400 line-through">${pkg.originalPrice.toFixed(2)}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1"><Wifi className="w-3 h-3" /> Data</span>
                    {pkg.hasVoice && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> Calls</span>}
                    {pkg.hasText && <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> SMS</span>}
                  </div>

                  {selectedId === pkg.id && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleBuy(pkg) }}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition-colors"
                    >
                      Buy Now - ${pkg.price.toFixed(2)}
                    </button>
                  )}

                  {selectedId !== pkg.id && (
                    <div className="flex items-center justify-center gap-1 text-xs text-indigo-600 font-medium">
                      <span>Select</span>
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust */}
      <section className="py-10 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> Instant activation</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> Keep your number</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> No physical SIM</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> 24/7 support</span>
          </div>
        </div>
      </section>
    </>
  )
}
