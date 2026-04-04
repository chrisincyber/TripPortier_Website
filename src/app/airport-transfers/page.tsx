import type { Metadata } from 'next'
import { Car, DollarSign, Plane, XCircle, Users, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Airport Transfers - Pre-booked Rides Worldwide',
  description: 'Book airport transfers with fixed prices. Your driver is waiting when you land. No haggling, no surprises.',
}

const DESTINATIONS = ['London', 'Paris', 'Rome', 'Barcelona', 'Amsterdam', 'Dubai', 'New York', 'Bangkok', 'Tokyo', 'Singapore', 'Athens', 'Istanbul']

export default function AirportTransfersPage() {
  return (
    <>
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 sm:py-28">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Your Driver is Waiting{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">When You Land</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-xl mx-auto mb-8">
            Fixed prices from $25. No hidden fees, no haggling. Just a confirmed driver with your name on a sign.
          </p>
          <button className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-emerald-500/25">
            Reserve Your Driver
          </button>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: 'Meet & Greet', desc: 'Driver waits for you with a name sign at arrivals.' },
              { icon: DollarSign, title: 'Fixed Prices', desc: 'Know exactly what you pay. No meter, no surprises.' },
              { icon: Plane, title: 'Flight Tracking', desc: 'Driver adjusts for delays. No extra charges.' },
              { icon: XCircle, title: 'Free Cancellation', desc: 'Cancel up to 24 hours before for a full refund.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-display font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-slate-900 text-center mb-8">Popular Destinations</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {DESTINATIONS.map((city) => (
              <span key={city} className="px-4 py-2 bg-white rounded-full border border-slate-200 text-sm font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer">
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
