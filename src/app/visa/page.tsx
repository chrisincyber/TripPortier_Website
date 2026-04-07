import type { Metadata } from 'next'
import { FileText, Globe, Clock, Shield, CheckCircle, AlertTriangle, BadgeCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Visa Requirements Checker - Free Tool',
  description: 'Instantly check if you need a visa for your destination. Get detailed requirements for your passport. Free tool covering 195 countries.',
  openGraph: {
    title: 'Free Visa Requirements Checker | TripPortier',
    description: 'Check visa requirements for any destination instantly. 195 countries covered.',
  },
}

const POPULAR_DESTINATIONS = [
  { name: 'Thailand', flag: '🇹🇭', status: 'free', label: 'Visa-Free (30 days)' },
  { name: 'Japan', flag: '🇯🇵', status: 'free', label: 'Visa-Free (90 days)' },
  { name: 'Turkey', flag: '🇹🇷', status: 'arrival', label: 'e-Visa / On Arrival' },
  { name: 'Australia', flag: '🇦🇺', status: 'required', label: 'eTA Required' },
  { name: 'Vietnam', flag: '🇻🇳', status: 'arrival', label: 'e-Visa Available' },
  { name: 'India', flag: '🇮🇳', status: 'required', label: 'e-Visa Required' },
  { name: 'Indonesia', flag: '🇮🇩', status: 'arrival', label: 'Visa on Arrival' },
  { name: 'United States', flag: '🇺🇸', status: 'required', label: 'ESTA / Visa' },
  { name: 'UAE', flag: '🇦🇪', status: 'arrival', label: 'Visa on Arrival' },
  { name: 'Brazil', flag: '🇧🇷', status: 'free', label: 'Visa-Free (90 days)' },
  { name: 'South Korea', flag: '🇰🇷', status: 'free', label: 'Visa-Free (90 days)' },
  { name: 'Egypt', flag: '🇪🇬', status: 'arrival', label: 'Visa on Arrival' },
]

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  free: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  arrival: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  required: { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' },
}

export default function VisaPage() {
  return (
    <>
      {/* Hero with form */}
      <section className="relative bg-gradient-to-br from-[#0f0f23] via-amber-950/30 to-[#0f0f23] text-white py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.1),_transparent_60%)]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.1] text-amber-300 text-sm font-medium mb-6">
            <FileText className="w-3.5 h-3.5" />
            Free Tool - 195 Countries
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
            Visa Requirements{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Checker</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10">
            Instantly check if you need a visa. Select your passport and destination below.
          </p>

          {/* Form card overlapping hero */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xl p-6 sm:p-8 text-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-slate-900">Check Visa Requirements</h2>
                  <p className="text-xs text-slate-500">Select your passport and destination</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Your Passport</label>
                  <select className="w-full px-3.5 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white outline-none transition-all">
                    <option>Select passport country...</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Destination</label>
                  <select className="w-full px-3.5 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white outline-none transition-all">
                    <option>Select destination...</option>
                  </select>
                </div>
              </div>

              <button className="w-full px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors text-sm">
                Check Requirements
              </button>
            </div>
          </div>

          {/* Status legend */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Visa-Free</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>On Arrival</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <FileText className="w-4 h-4 text-rose-400" />
              <span>Visa Required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular destinations with visa status */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 text-center mb-3">Popular Destinations</h2>
          <p className="text-sm text-slate-500 text-center mb-10 max-w-md mx-auto">Common visa requirements for EU passport holders. Results vary by nationality.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {POPULAR_DESTINATIONS.map((d) => {
              const style = STATUS_STYLES[d.status]
              return (
                <div
                  key={d.name}
                  className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:shadow-sm transition-shadow cursor-pointer"
                >
                  <span className="text-2xl shrink-0">{d.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900">{d.name}</p>
                    <p className="text-xs text-slate-500 truncate">{d.label}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${style.bg} ${style.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                    {d.status === 'free' ? 'Free' : d.status === 'arrival' ? 'On Arrival' : 'Required'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 text-center mb-3">Trusted & Accurate</h2>
          <p className="text-sm text-slate-500 text-center mb-12 max-w-md mx-auto">Our data is regularly verified against official government sources.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: Globe, title: '195 Countries', desc: 'Complete coverage for every country and territory in the world.' },
              { icon: Clock, title: 'Instant Results', desc: 'Get visa requirements in seconds. No signup required.' },
              { icon: Shield, title: 'Always Up to Date', desc: 'Requirements verified and updated regularly from official sources.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-xl bg-white border border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-display font-bold text-slate-900 mb-1.5">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Trust row */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-emerald-500" />
              <span>Official sources</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-500" />
              <span>Privacy protected</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-amber-500" />
              <span>No signup required</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
