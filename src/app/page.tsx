import Link from 'next/link'
import { Wifi, Car, FileText, Smartphone, ArrowRight, Globe, Shield, Zap } from 'lucide-react'

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.15),_transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-sm text-indigo-200 mb-6">
              <Globe className="w-4 h-4" />
              200+ Countries Covered
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              Travel Smarter,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                Not Harder
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-8 max-w-lg">
              eSIM data plans, airport transfers, visa checks, and AI trip planning - all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/esim"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25"
              >
                Get Your eSIM
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/app"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all backdrop-blur-sm"
              >
                <Smartphone className="w-4 h-4" />
                Download App
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Travel
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              One platform for all your travel essentials. No more juggling between apps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Wifi, title: 'eSIM Data Plans', desc: 'Instant connectivity in 200+ countries. No physical SIM needed.', href: '/esim', color: 'indigo' },
              { icon: Car, title: 'Airport Transfers', desc: 'Pre-booked rides from airport to hotel. Fixed prices, no surprises.', href: '/airport-transfers', color: 'emerald' },
              { icon: FileText, title: 'Visa Check', desc: 'Check visa requirements instantly for your passport and destination.', href: '/visa', color: 'amber' },
              { icon: Smartphone, title: 'Trip Planning', desc: 'AI-powered itineraries and smart travel recommendations.', href: '/app', color: 'violet' },
            ].map(({ icon: Icon, title, desc, href }) => (
              <Link
                key={href}
                href={href}
                className="group p-6 rounded-2xl border border-slate-200 hover:border-indigo-200 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { icon: Globe, title: '200+ Countries', desc: 'Global coverage for eSIM and transfers' },
              { icon: Shield, title: 'Secure Payments', desc: 'PCI-compliant with Stripe' },
              { icon: Zap, title: 'Instant Activation', desc: 'eSIM ready in seconds, not hours' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-display font-bold text-slate-900 mb-1">{title}</h3>
                <p className="text-sm text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Ready to Travel Smarter?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Join thousands of travelers who save time and money with TripPortier.
          </p>
          <Link
            href="/esim"
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg rounded-xl transition-all shadow-lg shadow-indigo-600/25"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  )
}
