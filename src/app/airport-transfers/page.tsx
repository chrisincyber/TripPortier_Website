import type { Metadata } from 'next'
import { Car, DollarSign, Plane, XCircle, Users, Clock, Shield, ArrowRight, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Airport Transfers - Pre-booked Rides Worldwide',
  description: 'Book airport transfers with fixed prices in 150+ countries. Your driver is waiting when you land. No haggling, no surprises.',
  openGraph: {
    title: 'Airport Transfers Worldwide | TripPortier',
    description: 'Fixed-price airport rides in 150+ countries. Meet & greet, flight tracking, free cancellation.',
  },
}

const BENEFITS = [
  { icon: Users, title: 'Meet & Greet', desc: 'Your driver waits at arrivals with a name sign. No searching, no stress.', color: 'emerald' },
  { icon: DollarSign, title: 'Fixed Prices', desc: 'Know exactly what you pay before you book. No meter, no surprises.', color: 'blue' },
  { icon: Plane, title: 'Flight Tracking', desc: 'We track your flight in real-time. Driver adjusts for delays at no extra charge.', color: 'violet' },
  { icon: XCircle, title: 'Free Cancellation', desc: 'Cancel up to 24 hours before for a full refund. Zero risk.', color: 'rose' },
]

const COLOR_MAP: Record<string, { bg: string; icon: string; ring: string }> = {
  emerald: { bg: 'bg-gradient-to-br from-emerald-400 to-teal-500', icon: 'text-white', ring: 'ring-emerald-500/20' },
  blue: { bg: 'bg-gradient-to-br from-blue-400 to-indigo-500', icon: 'text-white', ring: 'ring-blue-500/20' },
  violet: { bg: 'bg-gradient-to-br from-violet-400 to-purple-500', icon: 'text-white', ring: 'ring-violet-500/20' },
  rose: { bg: 'bg-gradient-to-br from-rose-400 to-pink-500', icon: 'text-white', ring: 'ring-rose-500/20' },
}

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
      {/* Dark luxurious hero */}
      <section className="relative bg-gradient-to-br from-[#0a0a1a] via-[#0f1a2e] to-[#0a0a1a] text-white py-24 sm:py-32 overflow-hidden">
        {/* Road-like line pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 49%, rgba(255,255,255,0.5) 49%, rgba(255,255,255,0.5) 51%, transparent 51%)`,
          backgroundSize: '60px 100%',
        }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(16,185,129,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(99,102,241,0.1),_transparent_50%)]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-emerald-300 text-sm font-medium mb-8">
            <Car className="w-4 h-4" />
            150+ Countries Covered
          </div>

          <h1 className="animate-fade-up font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6" style={{ animationDelay: '0.1s' }}>
            Your Driver is Waiting{' '}
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">When You Land</span>
          </h1>

          <p className="animate-fade-up text-lg sm:text-xl text-slate-300 max-w-xl mx-auto mb-10" style={{ animationDelay: '0.2s' }}>
            Fixed prices from $25. No hidden fees, no haggling. Just a confirmed driver with your name on a sign.
          </p>

          <div className="animate-fade-up flex flex-col sm:flex-row gap-4 justify-center" style={{ animationDelay: '0.3s' }}>
            <button className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5">
              Reserve Your Driver
            </button>
            <button className="px-8 py-3.5 glass text-white font-semibold rounded-xl hover:bg-white/10 transition-all">
              See How It Works
            </button>
          </div>

          {/* Trust stats */}
          <div className="animate-fade-up mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto" style={{ animationDelay: '0.4s' }}>
            {[
              { value: '150+', label: 'Countries' },
              { value: '500K+', label: 'Rides' },
              { value: '4.8', label: 'Rating' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-xs sm:text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits with colored icon circles */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-4">Why Book With Us</h2>
          <p className="text-slate-500 text-center mb-14 max-w-lg mx-auto">A seamless ride from the airport to your destination, every single time.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {BENEFITS.map(({ icon: Icon, title, desc, color }) => {
              const colors = COLOR_MAP[color]
              return (
                <div key={title} className="group text-center p-6 rounded-2xl hover:bg-slate-50 transition-all duration-300">
                  <div className={`w-16 h-16 rounded-2xl ${colors.bg} ring-4 ${colors.ring} flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 ${colors.icon}`} />
                  </div>
                  <h3 className="font-display font-bold text-slate-900 mb-2 text-lg">{title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-14">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Book Online', desc: 'Enter your airport, destination, and flight details. Get an instant fixed price.', icon: MapPin },
              { step: '02', title: 'We Track Your Flight', desc: 'Your driver monitors your flight and adjusts pickup time for delays.', icon: Plane },
              { step: '03', title: 'Get Picked Up', desc: 'Your driver meets you at arrivals with a name sign. Ride to your destination.', icon: Car },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="relative text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 font-display font-bold text-sm mb-4">
                  {step}
                </div>
                <h3 className="font-display font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular destinations with hover animations */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-4">Popular Destinations</h2>
          <p className="text-slate-500 text-center mb-10">Airport transfers in the world&apos;s most visited cities.</p>

          <div className="flex flex-wrap justify-center gap-3">
            {DESTINATIONS.map(({ city, flag }) => (
              <span
                key={city}
                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full border border-slate-200 text-sm font-medium text-slate-700 hover:border-emerald-300 hover:text-emerald-700 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer"
              >
                <span className="group-hover:scale-125 transition-transform duration-300">{flag}</span>
                {city}
                <ArrowRight className="w-3.5 h-3.5 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-emerald-500" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }} />
        <div className="relative max-w-3xl mx-auto px-4">
          <Shield className="w-10 h-10 mx-auto mb-4 opacity-80" />
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Book with Confidence</h2>
          <p className="text-emerald-100 mb-8 text-lg">Free cancellation up to 24h before. Fixed prices. No surprises.</p>
          <button className="px-8 py-3.5 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-all hover:shadow-lg hover:-translate-y-0.5">
            Reserve Your Transfer
          </button>
        </div>
      </section>
    </>
  )
}
