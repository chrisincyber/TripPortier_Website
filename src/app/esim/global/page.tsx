'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Globe, Wifi, Check, X, Phone, MessageSquare, Signal, Calendar, Zap, ChevronDown, Shield, Clock } from 'lucide-react'
import { EsimTabs } from '@/components/EsimTabs'
import { groupByData, parseData } from '@/lib/esim-utils'
import { useCurrency } from '@/lib/currency'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!

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
  coverageCountries?: string[]
  slug?: string
}

export default function GlobalEsimPage() {
  const { formatPrice } = useCurrency()
  const [packages, setPackages] = useState<EsimPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'standard' | 'unlimited'>('all')
  const [sortBy, setSortBy] = useState('price-asc')
  const [checkoutPkg, setCheckoutPkg] = useState<EsimPackage | null>(null)
  const [checkoutEmail, setCheckoutEmail] = useState('')
  const [checkoutError, setCheckoutError] = useState('')
  const [buying, setBuying] = useState<string | null>(null)

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/airalo-packages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'global' }),
        })
        const data = await res.json()
        if (data.success && data.packages) {
          setPackages(data.packages)
        } else {
          setError('No global eSIM plans available at the moment.')
        }
      } catch {
        setError('Failed to load plans. Please try again.')
      }
      setLoading(false)
    }
    fetchPackages()
  }, [])

  const filtered = packages.filter(pkg => {
    if (filter === 'unlimited') return pkg.isUnlimited
    if (filter === 'standard') return !pkg.isUnlimited
    return true
  })

  const useGrouped = sortBy === 'price-asc'
  const dataGroups = useGrouped ? groupByData(filtered) : []

  const sorted = useGrouped ? [] : [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'price-desc': return b.price - a.price
      case 'data-asc': return parseData(a.data) - parseData(b.data)
      case 'data-desc': return parseData(b.data) - parseData(a.data)
      case 'days-desc': return (b.days || 0) - (a.days || 0)
      default: return a.price - b.price
    }
  })

  const handleBuy = async () => {
    if (!checkoutPkg || !checkoutEmail.trim()) return
    setBuying(checkoutPkg.id)
    setCheckoutError('')
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/esim-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: checkoutEmail.trim(),
          packageId: checkoutPkg.id,
          packageName: `${checkoutPkg.title || checkoutPkg.data} - ${checkoutPkg.days} Days`,
          countryCode: 'GLOBAL',
          countryTitle: 'Worldwide',
          data: checkoutPkg.data,
          days: checkoutPkg.days,
          price: checkoutPkg.price,
          netPrice: checkoutPkg.price,
          operatorTitle: checkoutPkg.operatorTitle || 'TripPortier eSIM',
          hasVoice: checkoutPkg.hasVoice || false,
          hasText: checkoutPkg.hasText || false,
          tripcoinsUsed: 0,
          userId: null,
        }),
      })
      const data = await res.json()
      if (data.success && data.url) {
        window.location.href = data.url
      } else if (data.url || data.checkoutUrl) {
        window.location.href = data.url || data.checkoutUrl
      } else {
        setCheckoutError(data.error || 'Failed to create checkout. Please try again.')
      }
    } catch {
      setCheckoutError('An error occurred. Please try again.')
    }
    setBuying(null)
  }

  const renderCard = (pkg: EsimPackage) => {
    const isExpanded = expandedId === pkg.id
    return (
      <div key={pkg.id} className={`rounded-2xl border-2 overflow-hidden transition-all ${isExpanded ? 'border-indigo-500 shadow-lg shadow-indigo-500/10' : 'border-slate-200 hover:border-slate-300'}`}>
        <button onClick={() => setExpandedId(isExpanded ? null : pkg.id)} className="w-full flex items-center gap-4 p-4 sm:p-5 text-left">
          <div className="w-20 sm:w-24 shrink-0">
            <p className="font-display text-lg sm:text-xl font-bold text-slate-900">{pkg.data}</p>
            {pkg.isUnlimited && <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">UNLIMITED</span>}
          </div>
          <div className="flex-1 min-w-0">
            {pkg.title && <p className="text-sm font-medium text-slate-800 mb-0.5">{pkg.title}</p>}
            <p className="text-sm text-slate-600 mb-1">Lasts {pkg.days} days</p>
            {pkg.operatorTitle && <p className="text-xs text-slate-400 mb-1.5">by {pkg.operatorTitle}</p>}
            <div className="flex items-center gap-2 flex-wrap">
              <FeatureBadge icon={Wifi} label="Data" available />
              <FeatureBadge icon={MessageSquare} label="SMS" available={!!pkg.hasText} />
              <FeatureBadge icon={Phone} label="Calls" available={!!pkg.hasVoice} />
              {pkg.coverageCountries && pkg.coverageCountries.length > 0 && (
                <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{pkg.coverageCountries.length} countries</span>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="font-display text-xl font-bold text-slate-900">{formatPrice(pkg.price)}</p>
            <ChevronDown className={`w-4 h-4 text-slate-400 ml-auto mt-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </button>
        {isExpanded && (
          <div className="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-5 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <DetailRow icon={Wifi} label="Data" value={`${pkg.data}${pkg.isUnlimited ? ' (Unlimited)' : ''}`} />
              <DetailRow icon={Calendar} label="Validity" value={`${pkg.days} days`} />
              <DetailRow icon={Signal} label="Provider" value={pkg.operatorTitle || 'TripPortier eSIM'} />
              <DetailRow icon={MessageSquare} label="SMS" value={pkg.hasText ? 'Included' : 'Not included'} available={pkg.hasText} />
              <DetailRow icon={Phone} label="Voice" value={pkg.hasVoice ? 'Included' : 'Not included'} available={pkg.hasVoice} />
            </div>
            {pkg.coverageCountries && pkg.coverageCountries.length > 0 && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                <p className="text-xs font-medium text-blue-800 mb-1">Worldwide Coverage: {pkg.coverageCountries.length} countries</p>
                <p className="text-xs text-blue-600">{pkg.coverageCountries.slice(0, 10).join(', ')}{pkg.coverageCountries.length > 10 ? ` +${pkg.coverageCountries.length - 10} more` : ''}</p>
              </div>
            )}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <Zap className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-800"><strong>Worldwide:</strong> This plan works in 100+ countries. Your {pkg.days}-day validity starts when you first connect.</p>
            </div>
            <button onClick={() => { setCheckoutPkg(pkg); setCheckoutEmail(''); setCheckoutError('') }} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
              Proceed to Checkout - {formatPrice(pkg.price)}
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <EsimTabs />
      {/* Header */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/esim" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-5 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All destinations
          </Link>
          <div className="flex items-center gap-4">
            <Globe className="w-10 h-10 text-indigo-400" />
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold">Global eSIM Plans</h1>
              <p className="text-sm text-slate-400 mt-1">One plan, worldwide coverage. Stay connected everywhere you go.</p>
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
                {(['all', 'standard', 'unlimited'] as const).map(f => (
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
                <option value="data-asc">Least Data</option>
                <option value="data-desc">Most Data</option>
                <option value="days-desc">Longest Validity</option>
              </select>
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl border-2 border-slate-100 p-4 sm:p-5 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-20 sm:w-24 shrink-0"><div className="h-6 w-14 bg-slate-200 rounded" /></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 bg-slate-200 rounded" />
                      <div className="h-3 w-20 bg-slate-100 rounded" />
                      <div className="flex gap-2"><div className="h-5 w-12 bg-slate-100 rounded" /><div className="h-5 w-12 bg-slate-100 rounded" /><div className="h-5 w-12 bg-slate-100 rounded" /></div>
                    </div>
                    <div className="h-6 w-16 bg-slate-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-24">
              <p className="text-slate-500 mb-4">{error}</p>
              <Link href="/esim" className="text-sm text-indigo-600 font-medium">Browse other destinations</Link>
            </div>
          ) : (
            <div className="space-y-6">
              {useGrouped ? (
                dataGroups.map((group) => (
                  <div key={group.label}>
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-display text-sm font-bold text-slate-900">{group.label}</h3>
                      <div className="flex-1 h-px bg-slate-200" />
                      <span className="text-xs text-slate-400">{group.packages.length} plan{group.packages.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="space-y-3">
                      {group.packages.map(pkg => renderCard(pkg))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="space-y-3">
                  {sorted.map(pkg => renderCard(pkg))}
                </div>
              )}
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

      {/* Checkout Modal */}
      {checkoutPkg && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4" onClick={() => setCheckoutPkg(null)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 sm:p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-slate-900">Complete Your Purchase</h3>
                <button onClick={() => setCheckoutPkg(null)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-display font-bold text-slate-900">{checkoutPkg.title || `${checkoutPkg.data} - ${checkoutPkg.days} Days`}</h4>
                  <span className="font-display text-lg font-bold text-indigo-600">{formatPrice(checkoutPkg.price)}</span>
                </div>
                <p className="text-sm text-slate-500">Global / Worldwide Plan</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={checkoutEmail}
                  onChange={(e) => setCheckoutEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleBuy()}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  autoFocus
                />
                <p className="text-xs text-slate-400 mt-1">Your eSIM QR code will be sent to this email</p>
              </div>
              {checkoutError && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{checkoutError}</p>}
              <button
                onClick={handleBuy}
                disabled={!checkoutEmail.trim() || buying === checkoutPkg.id}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {buying === checkoutPkg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Pay {formatPrice(checkoutPkg.price)}</>}
              </button>
              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Secure checkout</span>
                <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Instant delivery</span>
              </div>
            </div>
          </div>
        </div>
      )}
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

function DetailRow({ icon: Icon, label, value, available }: {
  icon: React.ElementType; label: string; value: string; available?: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-slate-400 shrink-0" />
      <span className="text-slate-500">{label}</span>
      <span className={`ml-auto font-medium ${
        available === false ? 'text-slate-400' :
        available === true ? 'text-emerald-600' :
        'text-slate-900'
      }`}>{value}</span>
    </div>
  )
}

