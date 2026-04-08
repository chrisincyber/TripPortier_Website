'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Wifi, Clock, Loader2, Check, X, Phone, MessageSquare, Signal, Calendar, Zap, ChevronDown, Shield, Gift } from 'lucide-react'
import { COUNTRIES } from '@/lib/countries'
import { checkoutEmailSchema, countryCodeSchema, validate } from '@/lib/validation'
import { sanitizeError } from '@/lib/sanitize-error'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

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
}

export default function EsimCountryPage() {
  const params = useParams()
  const rawCode = (params.country as string)?.toUpperCase() || ''
  const codeValidation = countryCodeSchema.safeParse(rawCode)
  const countryCode = codeValidation.success ? codeValidation.data : ''
  const country = COUNTRIES.find((c) => c.code === countryCode)
  const [user, setUser] = useState<User | null>(null)
  const [packages, setPackages] = useState<EsimPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'standard' | 'unlimited'>('all')
  const [sortBy, setSortBy] = useState('price-asc')
  const [buying, setBuying] = useState<string | null>(null)
  const [checkoutPkg, setCheckoutPkg] = useState<EsimPackage | null>(null)
  const [checkoutEmail, setCheckoutEmail] = useState('')
  const [checkoutError, setCheckoutError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  useEffect(() => {
    if (!countryCode) return
    const fetchPackages = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/airalo-packages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'local', countryCode }),
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

  const handleProceedToCheckout = (pkg: EsimPackage) => {
    setCheckoutPkg(pkg)
    setCheckoutEmail('')
    setCheckoutError('')
  }

  const handleBuy = async () => {
    if (!checkoutPkg || !checkoutEmail.trim()) return

    const emailValidation = validate(checkoutEmailSchema, { email: checkoutEmail })
    if (!emailValidation.success) {
      setCheckoutError(emailValidation.error)
      return
    }

    setBuying(checkoutPkg.id)
    setCheckoutError('')
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/esim-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailValidation.data.email,
          packageId: checkoutPkg.id,
          packageName: `${checkoutPkg.data} - ${checkoutPkg.days} Days`,
          countryCode,
          countryTitle: country?.name || countryCode,
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
        setCheckoutError(sanitizeError(data.error, 'Failed to create checkout. Please try again.'))
      }
    } catch (err) {
      setCheckoutError(sanitizeError(err, 'An error occurred. Please try again.'))
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

                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                          <span className="text-base">🪙</span>
                          <p className="text-xs text-amber-800">
                            Earn up to <strong>10% back</strong> in TripCoins on this purchase
                          </p>
                        </div>

                        <button
                          onClick={() => handleProceedToCheckout(pkg)}
                          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          Proceed to Checkout - ${pkg.price.toFixed(2)}
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
              {/* Package summary */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-display font-bold text-slate-900">{checkoutPkg.data} - {checkoutPkg.days} Days</h4>
                  <span className="font-display text-lg font-bold text-indigo-600">${checkoutPkg.price.toFixed(2)}</span>
                </div>
                <p className="text-sm text-slate-500">{country?.flag} {country?.name || countryCode}</p>
                <div className="flex items-center gap-2 mt-2">
                  <FeatureBadge icon={Wifi} label="Data" available />
                  <FeatureBadge icon={MessageSquare} label="SMS" available={!!checkoutPkg.hasText} />
                  <FeatureBadge icon={Phone} label="Calls" available={!!checkoutPkg.hasVoice} />
                </div>
              </div>

              {/* Email */}
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

              {/* TripCoin signup prompt for guests */}
              {!user && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Gift className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 mb-0.5">Earn TripCoins on this purchase</p>
                      <p className="text-xs text-slate-600 leading-relaxed mb-2.5">
                        Sign up to earn up to 10% cashback. Redeem your TripCoins on future eSIM purchases.
                      </p>
                      <Link
                        href={`/account?redirect=/esim/${countryCode}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
                      >
                        Create free account <ArrowLeft className="w-3 h-3 rotate-180" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {checkoutError && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{checkoutError}</p>
              )}

              <button
                onClick={handleBuy}
                disabled={!checkoutEmail.trim() || buying === checkoutPkg.id}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {buying === checkoutPkg.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>Pay ${checkoutPkg.price.toFixed(2)}</>
                )}
              </button>

              {user && (
                <div className="flex items-center gap-2 justify-center text-xs text-amber-600">
                  <span>🪙</span>
                  <span>You will earn TripCoins on this purchase</span>
                </div>
              )}

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
