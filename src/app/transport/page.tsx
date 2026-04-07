import type { Metadata } from 'next'
import Link from 'next/link'
import { Car, Train, ArrowRight, Globe, MapPin, ExternalLink } from 'lucide-react'

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
      <section className="relative bg-gradient-to-br from-[#0f0f23] via-[#1a1a3e] to-[#0f0f23] text-white py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.12),_transparent_60%)]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.1] text-indigo-300 text-sm font-medium mb-6">
            <Globe className="w-3.5 h-3.5" />
            Worldwide Coverage
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
            Get There{' '}
            <span className="gradient-text">Your Way</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Airport transfers worldwide and Asia transport tickets -trains, buses, ferries and more, all in one place.
          </p>
        </div>
      </section>

      {/* Two big cards */}
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Airport Transfers Card */}
            <Link
              href="/airport-transfers"
              className="group relative flex flex-col p-8 sm:p-10 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:bg-indigo-100 transition-colors">
                <Car className="w-7 h-7 text-indigo-600" />
              </div>

              <h2 className="font-display text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">Airport Transfers</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                Private cars, shared shuttles, and taxi services from airport to hotel. Available in 150+ countries with confirmed drivers and fixed prices.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {['150+ countries', 'Fixed prices', 'Meet & greet'].map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-600 text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              <span className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600">
                Book a transfer <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            {/* Asia Transport Card */}
            <a
              href="https://asiatransport.tripportier.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col p-8 sm:p-10 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition-colors">
                <Train className="w-7 h-7 text-emerald-600" />
              </div>

              <h2 className="font-display text-2xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">Asia Transport</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                Train, bus, and ferry tickets across Southeast Asia. Thailand, Vietnam, Malaysia, Cambodia, Laos, and more -book online in minutes.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {['Trains', 'Buses', 'Ferries', '6+ countries'].map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600">
                Browse routes <ExternalLink className="w-4 h-4" />
              </span>
            </a>
          </div>

          {/* Bottom note */}
          <div className="mt-12 text-center">
            <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4" />
              More transport options coming soon -Europe rail, Middle East buses, and more.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
