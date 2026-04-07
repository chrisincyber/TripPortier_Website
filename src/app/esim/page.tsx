import type { Metadata } from 'next'
import { Search, Wifi, Globe, Zap, Shield, Clock, Smartphone, ArrowRight, Signal } from 'lucide-react'

export const metadata: Metadata = {
  title: 'eSIM Data Plans for 200+ Countries',
  description: 'Buy instant eSIM data plans for international travel. No physical SIM needed. Stay connected worldwide with 4G/5G speeds.',
  openGraph: {
    title: 'eSIM Data Plans for 200+ Countries | TripPortier',
    description: 'Instant activation, no physical SIM needed. Stay connected worldwide with TripPortier eSIM.',
  },
}

const REGIONS = [
  { name: 'Europe', emoji: '🇪🇺', countries: '40+ countries', from: '$4.50', gradient: 'from-blue-500 to-indigo-600', glow: 'group-hover:shadow-blue-500/20' },
  { name: 'Asia', emoji: '🌏', countries: '30+ countries', from: '$3.50', gradient: 'from-rose-500 to-pink-600', glow: 'group-hover:shadow-rose-500/20' },
  { name: 'Americas', emoji: '🌎', countries: '25+ countries', from: '$5.00', gradient: 'from-emerald-500 to-teal-600', glow: 'group-hover:shadow-emerald-500/20' },
  { name: 'Middle East', emoji: '🕌', countries: '15+ countries', from: '$5.50', gradient: 'from-amber-500 to-orange-600', glow: 'group-hover:shadow-amber-500/20' },
  { name: 'Africa', emoji: '🌍', countries: '20+ countries', from: '$6.00', gradient: 'from-violet-500 to-purple-600', glow: 'group-hover:shadow-violet-500/20' },
  { name: 'Oceania', emoji: '🏝️', countries: '10+ countries', from: '$5.00', gradient: 'from-cyan-500 to-sky-600', glow: 'group-hover:shadow-cyan-500/20' },
]

const BENEFITS = [
  { icon: Zap, title: 'Instant Activation', desc: 'Scan the QR code and connect in seconds. No store visits needed.', gradient: 'from-amber-400 to-orange-500' },
  { icon: Globe, title: '200+ Countries', desc: 'Coverage across the globe for all your travels and adventures.', gradient: 'from-blue-400 to-indigo-500' },
  { icon: Shield, title: 'Secure Connection', desc: 'Encrypted data with zero third-party sharing. Your privacy first.', gradient: 'from-emerald-400 to-teal-500' },
  { icon: Clock, title: 'Flexible Plans', desc: '1GB to unlimited data. 7 to 30 days. Pick what suits you.', gradient: 'from-violet-400 to-purple-500' },
  { icon: Smartphone, title: 'Keep Your Number', desc: 'Works alongside your main SIM. No need to swap anything.', gradient: 'from-rose-400 to-pink-500' },
  { icon: Wifi, title: 'High Speed 5G', desc: '4G/5G speeds wherever available. Stream, call, navigate freely.', gradient: 'from-cyan-400 to-sky-500' },
]

export default function EsimPage() {
  return (
    <>
      {/* Hero with world map pattern */}
      <section className="relative bg-gradient-to-br from-[#0f0f23] via-indigo-950 to-[#0f0f23] text-white py-24 sm:py-32 overflow-hidden">
        {/* World map dot pattern */}
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(99,102,241,0.25),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(139,92,246,0.15),_transparent_50%)]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-indigo-300 text-sm font-medium mb-8">
            <Signal className="w-4 h-4" />
            Instant Activation — No Physical SIM
          </div>

          <h1 className="animate-fade-up font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6" style={{ animationDelay: '0.1s' }}>
            Stay Connected in{' '}
            <span className="gradient-text">200+ Countries</span>
          </h1>

          <p className="animate-fade-up text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10" style={{ animationDelay: '0.2s' }}>
            Buy an eSIM, scan the QR code, and you are online. No store visits, no swapping SIMs, no roaming bills.
          </p>

          {/* Glass search bar */}
          <div className="animate-fade-up max-w-xl mx-auto" style={{ animationDelay: '0.3s' }}>
            <div className="glass rounded-2xl p-1.5 glow">
              <div className="flex items-center">
                <div className="flex-1 flex items-center gap-3 px-5">
                  <Search className="w-5 h-5 text-indigo-400" />
                  <span className="text-slate-400 text-sm">Search country or region...</span>
                </div>
                <button className="px-7 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 text-sm">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Region cards */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-4">Browse by Region</h2>
          <p className="text-slate-500 text-center mb-12 max-w-lg mx-auto">Pick your destination and get connected instantly. Plans start from just a few dollars.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {REGIONS.map((r) => (
              <div
                key={r.name}
                className={`group relative p-6 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl ${r.glow} hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden`}
              >
                {/* Gradient accent bar at top */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${r.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{r.emoji}</span>
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{r.name}</h3>
                    <p className="text-xs text-slate-500">{r.countries}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-600">
                    From <span className="font-bold text-lg text-slate-900">{r.from}</span>
                  </p>
                  <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Worldwide CTA */}
          <div className="mt-10 p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }} />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-sm font-medium mb-4">
                <Globe className="w-4 h-4" />
                Multi-Country Plan
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold mb-3">Worldwide eSIM</h3>
              <p className="text-indigo-100 mb-6 max-w-md mx-auto">One plan, every country. Perfect for multi-destination trips and digital nomads.</p>
              <button className="px-8 py-3 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-all hover:shadow-lg hover:shadow-white/20 hover:-translate-y-0.5">
                View Worldwide Plans
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits with gradient icon backgrounds */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-4">Why Choose TripPortier eSIM?</h2>
          <p className="text-slate-500 text-center mb-12 max-w-lg mx-auto">Everything you need for seamless connectivity abroad.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map(({ icon: Icon, title, desc, gradient }) => (
              <div key={title} className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
