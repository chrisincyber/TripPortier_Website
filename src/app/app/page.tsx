import type { Metadata } from 'next'
import Image from 'next/image'
import { Plane, MapPin, Bell, Wifi, Calendar, Brain, Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Download TripPortier App',
  description: 'Download the TripPortier app for iOS. Smart trip planning, real-time flight tracking, eSIM data plans, and more.',
}

const FEATURES = [
  { icon: Plane, title: 'Flight Tracking', desc: 'Real-time updates, delays, gate changes', badge: 'iOS' },
  { icon: Brain, title: 'AI Trip Planning', desc: 'Smart itineraries based on your preferences', badge: 'iOS' },
  { icon: Wifi, title: 'eSIM Data Plans', desc: 'Buy and activate eSIMs for 200+ countries', badge: 'Both' },
  { icon: Bell, title: 'Smart Notifications', desc: 'Alerts for flights, weather, and trip updates', badge: 'iOS' },
  { icon: Calendar, title: 'Trip Organization', desc: 'All your bookings in one place', badge: 'Both' },
  { icon: MapPin, title: 'Destination Guides', desc: 'Local tips, weather, and visa info', badge: 'Both' },
]

export default function AppPage() {
  return (
    <>
      <section className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.15),_transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                TripPortier{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">App</span>
              </h1>
              <p className="text-lg text-slate-300 mb-8">
                Your smart travel companion. Flight tracking, AI trip planning, eSIM data plans, and more - all in one beautiful app.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://apps.apple.com/app/tripportier"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  Download for iOS
                </a>
                <a href="/account" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20">
                  Use on Web
                </a>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="relative w-64 h-[500px]">
                <Image src="/assets/images/phone-center.png" alt="TripPortier App" fill className="object-contain" priority />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-10">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, badge }) => (
              <div key={title} className="p-5 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{badge}</span>
                </div>
                <h3 className="font-display font-bold text-slate-900 mb-1">{title}</h3>
                <p className="text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-display text-3xl font-bold mb-4">Ready to Travel Smarter?</h2>
          <p className="text-indigo-100 mb-8">Download TripPortier and start planning your next trip today.</p>
          <a href="https://apps.apple.com/app/tripportier" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-colors">
            Download for iOS
          </a>
        </div>
      </section>
    </>
  )
}
