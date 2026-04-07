import type { Metadata } from 'next'
import { Wifi, Globe, Zap, Shield, Clock, Smartphone, ArrowRight, Signal, Star } from 'lucide-react'
import { CountrySearch } from '@/components/CountrySearch'

export const metadata: Metadata = {
  title: 'eSIM Data Plans for 200+ Countries',
  description: 'Buy instant eSIM data plans for international travel. No physical SIM needed. Stay connected worldwide with 4G/5G speeds.',
  openGraph: {
    title: 'eSIM Data Plans for 200+ Countries | TripPortier',
    description: 'Instant activation, no physical SIM needed. Stay connected worldwide with TripPortier eSIM.',
  },
}

const POPULAR_COUNTRIES = [
  { name: 'Japan', flag: '🇯🇵', code: 'JP', from: '$3.50', data: '1-20 GB' },
  { name: 'Thailand', flag: '🇹🇭', code: 'TH', from: '$2.50', data: '1-15 GB' },
  { name: 'United States', flag: '🇺🇸', code: 'US', from: '$4.50', data: '1-20 GB' },
  { name: 'United Kingdom', flag: '🇬🇧', code: 'GB', from: '$4.00', data: '1-20 GB' },
  { name: 'South Korea', flag: '🇰🇷', code: 'KR', from: '$3.50', data: '1-20 GB' },
  { name: 'Turkey', flag: '🇹🇷', code: 'TR', from: '$4.00', data: '1-10 GB' },
  { name: 'Singapore', flag: '🇸🇬', code: 'SG', from: '$3.50', data: '1-15 GB' },
  { name: 'Australia', flag: '🇦🇺', code: 'AU', from: '$5.00', data: '1-20 GB' },
]

const REGIONS = [
  { name: 'Europe', emoji: '🇪🇺', countries: '40+ countries', from: '$4.50' },
  { name: 'Asia', emoji: '🌏', countries: '30+ countries', from: '$3.50' },
  { name: 'Americas', emoji: '🌎', countries: '25+ countries', from: '$5.00' },
  { name: 'Middle East', emoji: '🕌', countries: '15+ countries', from: '$5.50' },
  { name: 'Africa', emoji: '🌍', countries: '20+ countries', from: '$6.00' },
  { name: 'Oceania', emoji: '🏝️', countries: '10+ countries', from: '$5.00' },
]

const BENEFITS = [
  { icon: Zap, title: 'Instant Activation', desc: 'Scan the QR code and connect in seconds. No store visits needed.' },
  { icon: Globe, title: '200+ Countries', desc: 'Coverage across the globe for all your travels and adventures.' },
  { icon: Shield, title: 'Secure Connection', desc: 'Encrypted data with zero third-party sharing. Your privacy first.' },
  { icon: Clock, title: 'Flexible Plans', desc: '1GB to unlimited data. 7 to 30 days. Pick what suits you.' },
  { icon: Smartphone, title: 'Keep Your Number', desc: 'Works alongside your main SIM. No need to swap anything.' },
  { icon: Wifi, title: 'High Speed 5G', desc: '4G/5G speeds wherever available. Stream, call, navigate freely.' },
]

export default function EsimPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0f0f23] via-indigo-950 to-[#0f0f23] text-white py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(99,102,241,0.2),_transparent_50%)]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.1] text-indigo-300 text-sm font-medium mb-6">
            <Signal className="w-3.5 h-3.5" />
            Instant Activation — No Physical SIM
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
            Stay Connected in{' '}
            <span className="gradient-text">200+ Countries</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10">
            Buy an eSIM, scan the QR code, and you are online. No store visits, no swapping SIMs, no roaming bills.
          </p>

          {/* Search using CountrySearch component */}
          <div className="max-w-xl mx-auto">
            <CountrySearch
              placeholder="Where are you traveling?"
              targetPath="/esim"
              paramName="country"
              buttonLabel="Find Plans"
            />
          </div>

          {/* Trust stats */}
          <div className="mt-12 flex items-center justify-center gap-8 sm:gap-12 text-sm text-slate-400">
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span>4.8/5</span>
            </div>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline">200+ countries</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline">Instant delivery</span>
          </div>
        </div>
      </section>

      {/* Popular countries grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">Popular Destinations</h2>
              <p className="text-sm text-slate-500 mt-1">Most searched eSIM plans this month</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {POPULAR_COUNTRIES.map((c) => (
              <a
                key={c.code}
                href={`/esim/${c.code}`}
                className="group flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-md transition-all"
              >
                <span className="text-3xl shrink-0">{c.flag}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{c.name}</p>
                  <p className="text-xs text-slate-500">From <span className="font-semibold text-slate-700">{c.from}</span></p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Regional plans */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 text-center mb-3">Browse by Region</h2>
          <p className="text-sm text-slate-500 text-center mb-10 max-w-md mx-auto">Multi-country plans for when you are visiting more than one destination.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {REGIONS.map((r) => (
              <div
                key={r.name}
                className="group flex items-center gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer"
              >
                <span className="text-3xl shrink-0">{r.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{r.name}</h3>
                  <p className="text-xs text-slate-500">{r.countries}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-slate-900">From {r.from}</p>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 ml-auto mt-1 transition-colors" />
                </div>
              </div>
            ))}
          </div>

          {/* Worldwide CTA */}
          <div className="mt-8 p-6 sm:p-8 rounded-xl bg-indigo-600 text-white text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-sm font-medium mb-3">
              <Globe className="w-4 h-4" />
              Multi-Country Plan
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold mb-2">Worldwide eSIM</h3>
            <p className="text-indigo-100 mb-5 max-w-md mx-auto text-sm">One plan, every country. Perfect for multi-destination trips and digital nomads.</p>
            <button className="px-6 py-2.5 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50 transition-colors text-sm">
              View Worldwide Plans
            </button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 text-center mb-3">Why Choose TripPortier eSIM?</h2>
          <p className="text-sm text-slate-500 text-center mb-10 max-w-md mx-auto">Everything you need for seamless connectivity abroad.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-display font-bold text-slate-900 mb-1.5 text-sm">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
