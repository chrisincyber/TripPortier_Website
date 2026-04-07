import type { Metadata } from 'next'
import { Car, DollarSign, Plane, XCircle, Users, Clock, Shield, ArrowRight, MapPin, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Airport Transfers - Pre-booked Rides Worldwide',
  description: 'Book airport transfers with fixed prices in 150+ countries. Your driver is waiting when you land. No haggling, no surprises.',
  openGraph: {
    title: 'Airport Transfers Worldwide | TripPortier',
    description: 'Fixed-price airport rides in 150+ countries. Meet & greet, flight tracking, free cancellation.',
  },
}

const BENEFITS = [
  { icon: Users, title: 'Meet & Greet', desc: 'Your driver waits at arrivals with a name sign. No searching, no stress.' },
  { icon: DollarSign, title: 'Fixed Prices', desc: 'Know exactly what you pay before you book. No meter, no surprises.' },
  { icon: Plane, title: 'Flight Tracking', desc: 'We track your flight in real-time. Driver adjusts for delays at no extra charge.' },
  { icon: XCircle, title: 'Free Cancellation', desc: 'Cancel up to 24 hours before for a full refund. Zero risk.' },
]

const STEPS = [
  { step: '1', title: 'Book Online', desc: 'Enter your airport, destination, and flight details. Get an instant fixed price.', icon: MapPin },
  { step: '2', title: 'We Track Your Flight', desc: 'Your driver monitors your flight and adjusts pickup time for delays.', icon: Plane },
  { step: '3', title: 'Get Picked Up', desc: 'Your driver meets you at arrivals with a name sign. Ride to your destination.', icon: Car },
]

const DESTINATIONS = [
  { city: 'London', flag: '🇬🇧' },
  { city: 'Paris', flag: '🇫🇷' },
  { city: 'Rome', flag: '🇮🇹' },
  { city: 'Barcelona', flag: '🇪🇸' },
  { city: 'Amsterdam', flag: '🇳🇱' },
  { city: 'Dubai', flag: '🇦🇪' },
  { city: 'New York', flag: '🇺🇸' },
  { city: 'Bangkok', flag: '🇹🇭' },
  { city: 'Tokyo', flag: '🇯🇵' },
  { city: 'Singapore', flag: '🇸🇬' },
  { city: 'Athens', flag: '🇬🇷' },
  { city: 'Istanbul', flag: '🇹🇷' },
]

export default function AirportTransfersPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0a0a1a] via-[#0f1a2e] to-[#0a0a1a] text-white py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 49%, rgba(255,255,255,0.5) 49%, rgba(255,255,255,0.5) 51%, transparent 51%)`,
          backgroundSize: '60px 100%',
        }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(16,185,129,0.12),_transparent_60%)]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.1] text-emerald-300 text-sm font-medium mb-6">
            <Car className="w-3.5 h-3.5" />
            150+ Countries Covered
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
            Your Driver is Waiting{' '}
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">When You Land</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto mb-8">
            Fixed prices from $25. No hidden fees, no haggling. Just a confirmed driver with your name on a sign.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://www.welcomepickups.com/airport-transfer-booking/?a_aid=tripportier" target="_blank" rel="noopener noreferrer" className="px-7 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-emerald-500/25 text-sm inline-block">
              Reserve Your Driver
            </a>
            <a href="https://www.welcomepickups.com/airport-transfer-booking/?a_aid=tripportier" target="_blank" rel="noopener noreferrer" className="px-7 py-3 bg-white/[0.08] border border-white/[0.1] text-white font-semibold rounded-lg hover:bg-white/[0.12] transition-colors text-sm inline-block">
              See How It Works
            </a>
          </div>

          {/* Trust stats */}
          <div className="mt-14 grid grid-cols-3 gap-6 max-w-sm mx-auto">
            {[
              { value: '150+', label: 'Countries' },
              { value: '500K+', label: 'Rides' },
              { value: '4.8', label: 'Rating' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 text-center mb-3">Why Book With Us</h2>
          <p className="text-sm text-slate-500 text-center mb-12 max-w-md mx-auto">A seamless ride from the airport to your destination, every single time.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-display font-bold text-slate-900 mb-1.5">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 text-center mb-12">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map(({ step, title, desc }) => (
              <div key={step} className="relative text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-display font-bold text-sm mb-4">
                  {step}
                </div>
                <h3 className="font-display font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular destinations */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 text-center mb-3">Popular Destinations</h2>
          <p className="text-sm text-slate-500 text-center mb-8">Airport transfers in the world&apos;s most visited cities.</p>

          <div className="flex flex-wrap justify-center gap-2.5">
            {DESTINATIONS.map(({ city, flag }) => (
              <a
                key={city}
                href={`https://www.welcomepickups.com/airport-transfer-booking/?a_aid=tripportier&destination=${encodeURIComponent(city)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-4 py-2.5 bg-white rounded-full border border-slate-200 text-sm font-medium text-slate-700 hover:border-emerald-300 hover:text-emerald-700 hover:shadow-sm transition-all"
              >
                <span>{flag}</span>
                {city}
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-emerald-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-3 text-emerald-200">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Free cancellation up to 24h before</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">Book with Confidence</h2>
          <p className="text-emerald-100 mb-6 text-sm">Fixed prices. No surprises. Your driver is always waiting.</p>
          <a href="https://www.welcomepickups.com/airport-transfer-booking/?a_aid=tripportier" target="_blank" rel="noopener noreferrer" className="px-7 py-3 bg-white text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition-colors text-sm inline-block">
            Reserve Your Transfer
          </a>
        </div>
      </section>
    </>
  )
}
