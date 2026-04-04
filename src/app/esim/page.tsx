import type { Metadata } from 'next'
import { Search, Wifi, Globe, Zap, Shield, Clock, Smartphone, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'eSIM Data Plans for 200+ Countries',
  description: 'Buy instant eSIM data plans for international travel. No physical SIM needed. Stay connected worldwide.',
}

const REGIONS = [
  { name: 'Europe', emoji: '🇪🇺', countries: '40+ countries', from: '$4.50' },
  { name: 'Asia', emoji: '🌏', countries: '30+ countries', from: '$3.50' },
  { name: 'Americas', emoji: '🌎', countries: '25+ countries', from: '$5.00' },
  { name: 'Middle East', emoji: '🕌', countries: '15+ countries', from: '$5.50' },
  { name: 'Africa', emoji: '🌍', countries: '20+ countries', from: '$6.00' },
  { name: 'Oceania', emoji: '🏝️', countries: '10+ countries', from: '$5.00' },
]

const BENEFITS = [
  { icon: Zap, title: 'Instant Activation', desc: 'Scan the QR code and connect in seconds.' },
  { icon: Globe, title: '200+ Countries', desc: 'Coverage across the globe for all your travels.' },
  { icon: Shield, title: 'Secure Connection', desc: 'Encrypted data, no third-party sharing.' },
  { icon: Clock, title: 'Flexible Plans', desc: '1GB to unlimited, 7 to 30 days.' },
  { icon: Smartphone, title: 'Keep Your Number', desc: 'Works alongside your main SIM.' },
  { icon: Wifi, title: 'High Speed', desc: '4G/5G speeds wherever available.' },
]

export default function EsimPage() {
  return (
    <>
      <section className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(99,102,241,0.2),_transparent_50%)]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm mb-6">
            <Wifi className="w-4 h-4" />
            Instant Activation
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Buy eSIM Data for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">200+ Countries</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
            Instant activation, no physical SIM needed. Stay connected worldwide with TripPortier.
          </p>
          <div className="max-w-xl mx-auto">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-1.5">
              <div className="flex-1 flex items-center gap-2 px-4">
                <Search className="w-5 h-5 text-slate-400" />
                <span className="text-slate-400 text-sm">Search country or region...</span>
              </div>
              <button className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors text-sm">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-10">Browse by Region</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {REGIONS.map((r) => (
              <div key={r.name} className="group p-6 rounded-2xl border border-slate-200 hover:border-indigo-200 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-3xl">{r.emoji}</span>
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-900">{r.name}</h3>
                    <p className="text-xs text-slate-500">{r.countries}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-600">From <span className="font-bold text-indigo-600">{r.from}</span></p>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-center">
            <h3 className="font-display text-2xl font-bold mb-2">Worldwide eSIM</h3>
            <p className="text-indigo-100 mb-4">One plan, every country. Perfect for multi-destination trips.</p>
            <button className="px-6 py-2.5 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-colors">
              View Worldwide Plans
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-10">Why Choose TripPortier eSIM?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 rounded-xl bg-white border border-slate-200">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-display font-bold text-slate-900 mb-1">{title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
