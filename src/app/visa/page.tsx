import type { Metadata } from 'next'
import { FileText, Globe, Clock, Shield, CheckCircle, AlertTriangle, BadgeCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Visa Requirements Check - Free Tool',
  description: 'Instantly check if you need a visa for your destination. Get detailed requirements for your passport. Free tool covering 195 countries.',
  openGraph: {
    title: 'Free Visa Requirements Checker | TripPortier',
    description: 'Check visa requirements for any destination instantly. 195 countries covered.',
  },
}

export default function VisaPage() {
  return (
    <>
      {/* Hero with world map */}
      <section className="relative bg-gradient-to-br from-[#0f0f23] via-amber-950/40 to-[#0f0f23] text-white py-24 sm:py-32 overflow-hidden">
        {/* World map dot pattern */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.12),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(251,146,60,0.1),_transparent_50%)]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-amber-300 text-sm font-medium mb-8">
            <FileText className="w-4 h-4" />
            Free Tool — 195 Countries
          </div>

          <h1 className="animate-fade-up font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6" style={{ animationDelay: '0.1s' }}>
            Visa Requirements{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Checker</span>
          </h1>

          <p className="animate-fade-up text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto" style={{ animationDelay: '0.2s' }}>
            Instantly check if you need a visa for your destination. Get detailed requirements and apply online in minutes.
          </p>
        </div>
      </section>

      {/* Form card */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="-mt-20 relative">
            {/* Glass card with premium shadow */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-900/10 p-8 sm:p-10">
              {/* Gradient accent line */}
              <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 rounded-b-full" />

              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-display text-xl font-bold text-slate-900">Check Visa Requirements</h2>
              </div>
              <p className="text-sm text-slate-500 mb-8 ml-[52px]">Select your passport country and destination to see what you need.</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Your Passport</label>
                  <select className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white outline-none transition-all">
                    <option>Select your passport country...</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Destination</label>
                  <select className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white outline-none transition-all">
                    <option>Select destination...</option>
                  </select>
                </div>

                <button className="w-full px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5">
                  Check Requirements
                </button>
              </div>
            </div>
          </div>

          {/* Result types preview */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-700">Visa-Free</p>
                <p className="text-xs text-emerald-600">No visa needed</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-700">Visa on Arrival</p>
                <p className="text-xs text-amber-600">Get it when you land</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 border border-rose-100">
              <FileText className="w-5 h-5 text-rose-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-rose-700">Visa Required</p>
                <p className="text-xs text-rose-600">Apply before travel</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-4">Trusted & Accurate</h2>
          <p className="text-slate-500 text-center mb-14 max-w-lg mx-auto">Our data is regularly verified against official government sources.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: Globe, title: '195 Countries', desc: 'Complete coverage for every country and territory in the world.', gradient: 'from-blue-400 to-indigo-500' },
              { icon: Clock, title: 'Instant Results', desc: 'Get visa requirements in seconds. No signup required.', gradient: 'from-amber-400 to-orange-500' },
              { icon: Shield, title: 'Always Up to Date', desc: 'Requirements verified and updated regularly from official sources.', gradient: 'from-emerald-400 to-teal-500' },
            ].map(({ icon: Icon, title, desc, gradient }) => (
              <div key={title} className="group text-center p-8 rounded-2xl bg-white border border-slate-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display font-bold text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Trust row */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
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
