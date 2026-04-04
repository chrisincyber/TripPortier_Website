import type { Metadata } from 'next'
import Link from 'next/link'
import { Car, Train, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Transport Services',
  description: 'Airport transfers worldwide and Asia transport tickets. Trains, buses, ferries and more.',
}

export default function TransportPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="text-center mb-12">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Transport Services</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Airport transfers worldwide and Asia transport tickets - trains, buses, ferries and more, all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/airport-transfers" className="group p-8 rounded-2xl border border-slate-200 hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-5 group-hover:bg-indigo-100 transition-colors">
            <Car className="w-7 h-7 text-indigo-600" />
          </div>
          <h2 className="font-display text-xl font-bold text-slate-900 mb-2">Airport Transfers</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Private cars, shared shuttles, and taxi services from airport to hotel. Available in 150+ countries with confirmed drivers and fixed prices.
          </p>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 group-hover:gap-2 transition-all">
            Book a transfer <ArrowRight className="w-4 h-4" />
          </span>
        </Link>

        <a href="https://asiatransport.tripportier.com" target="_blank" rel="noopener noreferrer" className="group p-8 rounded-2xl border border-slate-200 hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5 group-hover:bg-emerald-100 transition-colors">
            <Train className="w-7 h-7 text-emerald-600" />
          </div>
          <h2 className="font-display text-xl font-bold text-slate-900 mb-2">Asia Transport</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Train, bus, and ferry tickets across Southeast Asia. Thailand, Vietnam, Malaysia, Cambodia, Laos, and more - book online in minutes.
          </p>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 group-hover:gap-2 transition-all">
            Browse routes <ArrowRight className="w-4 h-4" />
          </span>
        </a>
      </div>
    </div>
  )
}
