'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Wifi, Clock, Loader2, Check, X, Phone, MessageSquare, Signal, Calendar, Zap, ChevronDown, Shield } from 'lucide-react'
import { COUNTRIES } from '@/lib/countries'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bomkdhuckqosvuhfhyci.supabase.co'

interface EsimPackage {
  id: string
  title?: string
  data: string
  days: number
  validity?: string
  price: number
  originalPrice?: number
  hasVoice?: boolean
  hasText?: boolean
  isUnlimited?: boolean
  operatorTitle?: string
  networkProvider?: string
}

export default function EsimCountryPage() {
  const params = useParams()
  const countryCode = (params.country as string)?.toUpperCase()
  const country = COUNTRIES.find((c) => c.code === countryCode)
  const [packages, setPackages] = useState<EsimPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'standard' | 'unlimited'>('all')
  const [sortBy, setSortBy] = useState('price-asc')
  const [buying, setBuying] = useState<string | null>(null)

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
          setError('No eSIM plans available for this destination yet.')
        }
      } catch {
        setError('Failed to load plans. Please try again.')
      }
      setLoading(false)
    }
    fetchPackages()
  }, [countryCode])

  const hasVoicePackages = packages.some((p) => p.hasVoice)
  const hasTextPackages = packages.some((p) => p.hasText)

  const filtered = packages.filter((pkg) => {
    if (filter === 'unlimited') return pkg.isUnlimited
    if (filter === 'standard') return !pkg.isUnlimited
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return a.price - b.price
      case 'price-desc': return b.price - a.price
      case 'data-desc': return parseData(b.data) - parseData(a.data)
      case 'days-desc': return (b.days || 0) - (a.days || 0)
      default: return 0
    }
  })

  const handleBuy = async (pkg: EsimPackage) => {
    setBuying(pkg.id)
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/esim-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: pkg.id, countryCode, countryName: country?.name || countryCode }),
      })
      const data = await res.json()
      if (data.url || data.checkoutUrl) {
        window.location.href = data.url || data.checkoutUrl
      }
    } catch {
      alert('Failed to start checkout. Please try again.')
    }
    setBuying(null)
  }

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/esim" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-5 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All destinations
          </Link>
          <div className="flex items-center gap-4">
            {country && <span className="text-5xl">{country.flag}</span>}
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold">{country?.name || countryCode} eSIM</h1>
              <div className="flex items-center gap-3 mt-2 text-sm text-slate-400">
                <span className="flex items-center gap-1"><Wifi className="w-3.5 h-3.5 text-emerald-400" /> Data</span>
                <span className={`flex items-center gap-1 ${hasTextPackages ? 'text-slate-400' : 'text-slate-600'}`}>
                  <MessageSquare className="w-3.5 h-3.5" /> SMS {hasTextPackages ? '' : '(some plans)'}
                </span>
                <span className={`flex items-center gap-1 ${hasVoicePackages ? 'text-slate-400' : 'text-slate-600'}`}>
                  <Phone className="w-3.5 h-3.5" /> Calls {hasVoicePackages ? '' : '(some plans)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-8 sm:py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Toolbar */}
          {!loading && !error && packages.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div className="flex gap-1.5">
                {(['all', 'standard', 'unlimited'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      filter === f ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f === 'all' ? `All (${packages.length})` : f === 'unlimited' ? 'Unlimited' : 'Standard'}
                  </button>
                ))}
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 bg-white"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="data-desc">Most Data</option>
                <option value="days-desc">Longest Validity</option>
              </select>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center py-24">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
              <p className="text-sm text-slate-500">Loading eSIM plans for {country?.name || countryCode}...</p>
            </div>
          ) : error ? (
            <div className="text-center py-24">
              <p className="text-slate-500 mb-4">{error}</p>
              <Link href="/esim" className="text-sm text-indigo-600 font-medium">Browse other destinations</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {sorted.map((pkg) => {
                const isExpanded = expandedId === pkg.id
                return (
                  <div
                    key={pkg.id}
                    className={`rounded-2xl border-2 overflow-hidden transition-all ${
                      isExpanded ? 'border-indigo-500 shadow-lg shadow-indigo-500/10' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Collapsed card */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : pkg.id)}
                      className="w-full flex items-center gap-4 p-4 sm:p-5 text-left"
                    >
                      {/* Data amount */}
                      <div className="w-20 sm:w-24 shrink-0">
                        <p className="font-display text-lg sm:text-xl font-bold text-slate-900">{pkg.data}</p>
                        {pkg.isUnlimited && (
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">UNLIMITED</span>
                        )}
                      </div>

                      {/* Features */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-600 mb-1">{pkg.days} days validity</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <FeatureBadge icon={Wifi} label="Data" available />
                          <FeatureBadge icon={MessageSquare} label="SMS" available={!!pkg.hasText} />
                          <FeatureBadge icon={Phone} label="Calls" available={!!pkg.hasVoice} />
                          {pkg.networkProvider && (
                            <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{pkg.networkProvider}</span>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right shrink-0">
                        <p className="font-display text-xl font-bold text-slate-900">${pkg.price.toFixed(2)}</p>
                        <ChevronDown className={`w-4 h-4 text-slate-400 ml-auto mt-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-5 space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <DetailRow icon={Wifi} label="Data" value={`${pkg.data}${pkg.isUnlimited ? ' (Unlimited)' : ''}`} />
                          <DetailRow icon={Calendar} label="Validity" value={`${pkg.days} days`} />
                          <DetailRow icon={Signal} label="Provider" value={pkg.operatorTitle || 'TripPortier eSIM'} />
                          {pkg.networkProvider && <DetailRow icon={Signal} label="Network" value={pkg.networkProvider} highlight />}
                          <DetailRow icon={MessageSquare} label="SMS" value={pkg.hasText ? 'Included' : 'Not included'} available={pkg.hasText} />
                          <DetailRow icon={Phone} label="Voice Calls" value={pkg.hasVoice ? 'Included' : 'Not included'} available={pkg.hasVoice} />
                        </div>

                        <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                          <Zap className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-emerald-800">
                            <strong>Activation:</strong> Your {pkg.days}-day plan starts when you first connect to a network at your destination - not when you install the eSIM.
                          </p>
                        </div>

                        <button
                          onClick={() => handleBuy(pkg)}
                          disabled={buying === pkg.id}
                          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          {buying === pkg.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>Proceed to Checkout - ${pkg.price.toFixed(2)}</>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Trust */}
      <section className="py-10 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { icon: Zap, label: 'Instant activation' },
              { icon: Shield, label: 'Secure payment' },
              { icon: Wifi, label: 'Keep your number' },
              { icon: Clock, label: '24/7 support' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-xs text-slate-600 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function FeatureBadge({ icon: Icon, label, available }: { icon: React.ElementType; label: string; available: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded ${
      available ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400 bg-slate-100'
    }`}>
      {available ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
      {label}
    </span>
  )
}

function DetailRow({ icon: Icon, label, value, available, highlight }: {
  icon: React.ElementType; label: string; value: string; available?: boolean; highlight?: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-slate-400 shrink-0" />
      <span className="text-slate-500">{label}</span>
      <span className={`ml-auto font-medium ${
        highlight ? 'text-blue-600' :
        available === false ? 'text-slate-400' :
        available === true ? 'text-emerald-600' :
        'text-slate-900'
      }`}>{value}</span>
    </div>
  )
}

function parseData(dataStr: string): number {
  if (!dataStr) return 0
  const lower = dataStr.toLowerCase()
  if (lower.includes('unlimited')) return 9999
  const match = lower.match(/(\d+\.?\d*)\s*(gb|mb|tb)/)
  if (!match) return 0
  const amount = parseFloat(match[1])
  if (match[2] === 'tb') return amount * 1000
  if (match[2] === 'gb') return amount
  if (match[2] === 'mb') return amount / 1000
  return 0
}
