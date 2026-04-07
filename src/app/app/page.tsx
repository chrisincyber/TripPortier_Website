import type { Metadata } from 'next'
import Image from 'next/image'
import { Plane, MapPin, Bell, Wifi, Calendar, Brain, Sparkles, Download } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Download TripPortier App',
  description: 'Download the TripPortier app for iOS. Smart trip planning, real-time flight tracking, eSIM data plans, and more.',
  openGraph: {
    title: 'Download TripPortier App | iOS',
    description: 'Your smart travel companion. Flight tracking, AI trip planning, eSIM data, and more.',
  },
}

const FEATURES = [
  { icon: Plane, title: 'Flight Tracking', desc: 'Real-time updates, delays, gate changes, baggage info.', badge: 'iOS', gradient: 'from-sky-400 to-blue-500' },
  { icon: Brain, title: 'AI Trip Planning', desc: 'Smart itineraries tailored to your travel style.', badge: 'iOS', gradient: 'from-violet-400 to-purple-500' },
  { icon: Wifi, title: 'eSIM Data Plans', desc: 'Buy and activate eSIMs for 200+ countries instantly.', badge: 'Both', gradient: 'from-indigo-400 to-blue-500' },
  { icon: Bell, title: 'Smart Notifications', desc: 'Alerts for flights, weather changes, and trip updates.', badge: 'iOS', gradient: 'from-amber-400 to-orange-500' },
  { icon: Calendar, title: 'Trip Organization', desc: 'All your bookings beautifully organized in one place.', badge: 'Both', gradient: 'from-emerald-400 to-teal-500' },
  { icon: MapPin, title: 'Destination Guides', desc: 'Local tips, weather forecasts, and visa info at a glance.', badge: 'Both', gradient: 'from-rose-400 to-pink-500' },
]

export default function AppPage() {
  return (
    <>
      {/* Apple-style hero */}
      <section className="relative bg-gradient-to-b from-[#0f0f23] via-[#13132e] to-[#0f0f23] text-white py-24 sm:py-32 overflow-hidden">
        {/* Radial glow behind phone */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.2),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(139,92,246,0.1),_transparent_40%)]" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-indigo-300 text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4" />
                Your Travel Companion
              </div>

              <h1 className="animate-fade-up font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]" style={{ animationDelay: '0.1s' }}>
                TripPortier{' '}
                <span className="gradient-text">App</span>
              </h1>

              <p className="animate-fade-up text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed" style={{ animationDelay: '0.2s' }}>
                Flight tracking, AI trip planning, eSIM data plans, and more — all in one beautifully designed app.
              </p>

              <div className="animate-fade-up flex flex-col sm:flex-row gap-4" style={{ animationDelay: '0.3s' }}>
                <a
                  href="https://apps.apple.com/app/tripportier"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-7 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-all hover:-translate-y-0.5 hover:shadow-lg shadow-lg shadow-white/10"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  Download for iOS
                </a>
                <a
                  href="/account"
                  className="inline-flex items-center justify-center gap-3 px-7 py-4 glass text-white font-semibold rounded-xl hover:bg-white/10 transition-all hover:-translate-y-0.5"
                >
                  Use on Web
                </a>
              </div>

              {/* Social proof */}
              <div className="animate-fade-up mt-10 flex items-center gap-6 text-sm text-slate-400" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
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
                {/* Glow behind phone */}
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

      {/* Features grid */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Everything You Need to Travel Smart</h2>
            <p className="text-slate-500 max-w-lg mx-auto">Powerful features designed to make every trip seamless.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, badge, gradient }) => (
              <div key={title} className="group p-6 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    badge === 'iOS'
                      ? 'bg-slate-900 text-white'
                      : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    {badge}
                  </span>
                </div>
                <h3 className="font-display font-bold text-slate-900 mb-2 text-lg">{title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="relative py-24 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 text-white text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.1),_transparent_50%)]" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }} />

        <div className="relative max-w-3xl mx-auto px-4">
          <Download className="w-10 h-10 mx-auto mb-4 opacity-80" />
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Ready to Travel Smarter?</h2>
          <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto">Download TripPortier and join thousands of travelers who plan better trips.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://apps.apple.com/app/tripportier"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-all hover:-translate-y-0.5 shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              Download for iOS
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
