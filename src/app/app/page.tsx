import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  Plane, MapPin, Bell, Wifi, Calendar, Brain, Sparkles, Download,
  CheckCircle, Shield, Zap, Globe, Users, Star, Luggage, CloudSun,
  Share2, CreditCard,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Download TripPortier App',
  description: 'Download the TripPortier app for iOS. Smart trip planning, real-time flight tracking, eSIM data plans, and more.',
  openGraph: {
    title: 'Download TripPortier App | iOS',
    description: 'Your smart travel companion. Flight tracking, AI trip planning, eSIM data, and more.',
  },
}

const FEATURES = [
  { icon: Plane, title: 'Flight Tracking', desc: 'Real-time updates on delays, gate changes, and baggage carousel. Never miss a beat.', badge: 'iOS' },
  { icon: Brain, title: 'AI Trip Planning', desc: 'Get personalized itineraries based on your travel style, budget, and interests.', badge: 'iOS' },
  { icon: Wifi, title: 'eSIM Data Plans', desc: 'Buy and activate eSIMs for 200+ countries. Online the moment you land.', badge: 'Both' },
  { icon: Bell, title: 'Smart Notifications', desc: 'Flight delays, weather alerts, and trip reminders. Always one step ahead.', badge: 'iOS' },
  { icon: Calendar, title: 'Trip Organization', desc: 'Flights, hotels, activities, and documents. All beautifully organized.', badge: 'Both' },
  { icon: MapPin, title: 'Destination Guides', desc: 'Local tips, weather forecasts, and visa requirements at a glance.', badge: 'Both' },
  { icon: Luggage, title: 'Smart Packing Lists', desc: 'AI suggests what to pack based on destination, weather, and trip length.', badge: 'iOS' },
  { icon: CloudSun, title: 'Weather Forecasts', desc: 'Multi-day forecasts for your destination. Know what to expect before you go.', badge: 'iOS' },
  { icon: Share2, title: 'Trip Sharing', desc: 'Share your trip with friends and family. Everyone stays in the loop.', badge: 'iOS' },
]

const HOW_IT_WORKS = [
  { step: '1', title: 'Download', desc: 'Get the free app from the App Store. Create your account in seconds.' },
  { step: '2', title: 'Plan', desc: 'Add your destination, dates, and activities. AI helps with suggestions.' },
  { step: '3', title: 'Book', desc: 'Buy eSIMs, book transfers, and check visa requirements. All in one place.' },
  { step: '4', title: 'Travel', desc: 'Track flights, get alerts, and access everything offline. Stress-free.' },
]

export default function AppPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-[#0f0f23] via-[#13132e] to-[#0f0f23] text-white py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.15),_transparent_50%)]" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.1] text-indigo-300 text-sm font-medium mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Your Travel Companion
              </div>

              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5 leading-[1.1]">
                TripPortier{' '}
                <span className="gradient-text">App</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 mb-4 leading-relaxed">
                Plan trips with AI, track flights in real-time, buy eSIMs, and organize everything in one app.
              </p>

              <ul className="space-y-2 mb-8">
                {['AI-powered trip planning', 'Real-time flight tracking', 'eSIM for 200+ countries', 'Smart packing lists'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://apps.apple.com/app/tripportier"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors text-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  Download for iOS
                </a>
                <Link
                  href="/esim"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white/[0.08] border border-white/[0.1] text-white font-semibold rounded-lg hover:bg-white/[0.12] transition-colors text-sm"
                >
                  Browse eSIM Plans
                </Link>
              </div>

              {/* Social proof */}
              <div className="mt-8 flex items-center gap-5 text-sm text-slate-400">
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span>4.8 rating</span>
                </div>
                <span className="text-slate-600">|</span>
                <span>Free to download</span>
              </div>
            </div>

            {/* Phone mockup */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 to-violet-500/20 blur-3xl scale-110 rounded-full" />
                <div className="relative w-72 h-[560px]">
                  <Image
                    src="/assets/images/phone-center.png"
                    alt="TripPortier App on iPhone"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-3">How It Works</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">From download to departure in 4 simple steps.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-display font-bold text-sm flex items-center justify-center mx-auto mb-3">
                  {step}
                </div>
                <h3 className="font-display font-bold text-slate-900 mb-1 text-sm">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-3">Packed with Features</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">Everything you need for seamless trips, all in your pocket.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc, badge }) => (
              <div key={title} className="p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    badge === 'iOS'
                      ? 'bg-slate-900 text-white'
                      : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    {badge}
                  </span>
                </div>
                <h3 className="font-display font-bold text-slate-900 mb-1 text-sm">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Web vs App comparison */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-3">Web vs. App</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">Use both for the full TripPortier experience.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-6 rounded-2xl bg-white border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-4">
                <Globe className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-display font-bold text-slate-900 mb-2">tripportier.com</h3>
              <ul className="space-y-2">
                {['Buy eSIM data plans', 'Book airport transfers', 'Check visa requirements', 'Manage your account'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-white border-2 border-indigo-200 relative">
              <span className="absolute -top-2.5 left-4 px-2.5 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full">RECOMMENDED</span>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-4">
                <Download className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-display font-bold text-slate-900 mb-2">TripPortier App</h3>
              <ul className="space-y-2">
                {['Everything on the web, plus:', 'AI trip planning and suggestions', 'Real-time flight tracking', 'Smart packing lists', 'Push notifications', 'Offline access'].map((item, i) => (
                  <li key={item} className={`flex items-center gap-2 text-sm ${i === 0 ? 'text-indigo-600 font-medium' : 'text-slate-600'}`}>
                    {i > 0 && <CheckCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { icon: Users, value: '50K+', label: 'Travelers' },
              { icon: Globe, value: '200+', label: 'Countries' },
              { icon: Shield, value: '100%', label: 'Secure' },
              { icon: CreditCard, value: 'Free', label: 'To Download' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label}>
                <Icon className="w-5 h-5 text-indigo-500 mx-auto mb-2" />
                <p className="font-display text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Android note */}
      <section className="py-10 bg-slate-50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-600 mb-2">
            <span className="font-semibold">Android coming soon.</span> We are working on it.
          </p>
          <p className="text-xs text-slate-400">In the meantime, Android users can use all web features including eSIM purchases at tripportier.com</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-indigo-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <Download className="w-8 h-8 mx-auto mb-3 opacity-80" />
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">Start Planning Your Next Trip</h2>
          <p className="text-indigo-100 text-sm mb-8 max-w-lg mx-auto">Join 50,000+ travelers who use TripPortier to explore the world.</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://apps.apple.com/app/tripportier"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50 transition-colors text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              Download for iOS
            </a>
            <Link
              href="/esim"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/[0.15] border border-white/20 text-white font-semibold rounded-lg hover:bg-white/[0.25] transition-colors text-sm"
            >
              <Wifi className="w-4 h-4" />
              Browse eSIM Plans
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
