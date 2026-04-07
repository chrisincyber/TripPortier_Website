import type { Metadata } from 'next'
import Link from 'next/link'
import { Car, Train, ArrowRight, Globe, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Transport Services - Transfers & Asia Tickets',
  description: 'Airport transfers worldwide and Asia transport tickets. Trains, buses, ferries and more, all bookable online.',
  openGraph: {
    title: 'Transport Services | TripPortier',
    description: 'Airport transfers in 150+ countries and train, bus, ferry tickets across Southeast Asia.',
  },
}

export default function TransportPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0f0f23] via-[#1a1a3e] to-[#0f0f23] text-white py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.12),_transparent_60%)]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-indigo-300 text-sm font-medium mb-8">
            <Globe className="w-4 h-4" />
            Worldwide Coverage
          </div>

          <h1 className="animate-fade-up font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6" style={{ animationDelay: '0.1s' }}>
            Get There{' '}
            <span className="gradient-text">Your Way</span>
          </h1>

          <p className="animate-fade-up text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto" style={{ animationDelay: '0.2s' }}>
            Airport transfers worldwide and Asia transport tickets — trains, buses, ferries and more, all in one place.
          </p>
        </div>
      </section>

      {/* Two big cards */}
      <section className="py-20 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Airport Transfers Card */}
            <Link
              href="/airport-transfers"
              className="group relative p-8 sm:p-10 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
            >
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity" style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(99,102,241,0.5) 10px, rgba(99,102,241,0.5) 11px)`,
              }} />
              {/* Gradient glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-violet-50/0 group-hover:from-indigo-50/50 group-hover:to-violet-50/30 transition-all duration-500 rounded-2xl" />

              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/25 group-hover:scale-110 group-hover:shadow-indigo-500/40 transition-all duration-300">
                  <Car className="w-8 h-8 text-white" />
                </div>

                <h2 className="font-display text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">Airport Transfers</h2>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Private cars, shared shuttles, and taxi services from airport to hotel. Available in 150+ countries with confirmed drivers and fixed prices.
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {['150+ countries', 'Fixed prices', 'Meet & greet'].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                <span className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 group-hover:gap-3 transition-all duration-300">
                  Book a transfer <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>

            {/* Asia Transport Card */}
            <a
              href="https://asiatransport.tripportier.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-8 sm:p-10 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
            >
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity" style={{
                backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(16,185,129,0.5) 10px, rgba(16,185,129,0.5) 11px)`,
              }} />
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-teal-50/0 group-hover:from-emerald-50/50 group-hover:to-teal-50/30 transition-all duration-500 rounded-2xl" />

              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/25 group-hover:scale-110 group-hover:shadow-emerald-500/40 transition-all duration-300">
                  <Train className="w-8 h-8 text-white" />
                </div>

                <h2 className="font-display text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">Asia Transport</h2>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Train, bus, and ferry tickets across Southeast Asia. Thailand, Vietnam, Malaysia, Cambodia, Laos, and more — book online in minutes.
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {['Trains', 'Buses', 'Ferries', '6+ countries'].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 group-hover:gap-3 transition-all duration-300">
                  Browse routes <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </a>
          </div>

          {/* Bottom info */}
          <div className="mt-16 text-center">
            <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4" />
              More transport options coming soon — Europe rail, Middle East buses, and more.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
