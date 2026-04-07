import type { Metadata } from 'next'
import { Check, Sparkles, Brain, Plane, MapPin, Calendar, Bell, Crown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'TripPortier+ Premium - Upgrade Your Travel',
  description: 'Upgrade to TripPortier+ for AI trip planning, flight tracking, calendar sync, and more premium travel features.',
  openGraph: {
    title: 'TripPortier+ Premium | Upgrade Your Travel',
    description: 'AI trip planning, flight tracking, and more. Plans from $4.99/month.',
  },
}

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['1 active trip', 'Basic packing list', 'eSIM browsing', 'Visa check'],
    cta: 'Current Plan',
    style: 'default' as const,
  },
  {
    name: 'Monthly',
    price: '$4.99',
    period: '/month',
    features: ['Unlimited trips', 'AI smart suggestions', 'Flight tracking', 'Calendar sync', 'Extended weather', 'Priority support'],
    cta: 'Subscribe',
    style: 'default' as const,
  },
  {
    name: 'Yearly',
    price: '$29.99',
    period: '/year',
    savings: 'Save 50%',
    features: ['Everything in Monthly', 'AI trip planning', 'Multi-destination', 'Offline mode', 'All future features'],
    cta: 'Best Value',
    style: 'primary' as const,
  },
]

const PREMIUM_FEATURES = [
  { icon: Brain, title: 'AI Trip Planning', desc: 'Get smart itineraries tailored to your travel style and preferences.' },
  { icon: Plane, title: 'Flight Tracking', desc: 'Real-time updates, delays, gate changes, and baggage carousel info.' },
  { icon: Calendar, title: 'Calendar Sync', desc: 'Auto-sync your trip with Apple Calendar or Google Calendar.' },
  { icon: MapPin, title: 'Multi-Destination', desc: 'Plan complex trips with multiple stops, routes, and connections.' },
  { icon: Bell, title: 'Smart Alerts', desc: 'Get notified about weather changes, delays, and trip updates.' },
  { icon: Sparkles, title: 'All Future Features', desc: 'Early access to new features as we build and ship them.' },
]

export default function PremiumPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0f0f23] via-indigo-950/50 to-[#0f0f23] text-white py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.15),_transparent_50%)]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.1] text-indigo-300 text-sm font-medium mb-6">
            <Crown className="w-3.5 h-3.5" />
            TripPortier+
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
            Upgrade Your{' '}
            <span className="gradient-text">Travel Experience</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            AI trip planning, real-time flight tracking, and premium features that make every trip better.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map((plan) => {
              const isPrimary = plan.style === 'primary'
              return (
                <div
                  key={plan.name}
                  className={`relative rounded-xl p-6 text-left transition-all ${
                    isPrimary
                      ? 'bg-white border-2 border-indigo-500 shadow-xl shadow-indigo-500/10 md:scale-105'
                      : 'bg-white border border-slate-200 hover:shadow-md'
                  }`}
                >
                  {plan.savings && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-indigo-600 text-white text-xs font-bold rounded-full">
                      {plan.savings}
                    </span>
                  )}

                  <h3 className="font-display font-bold text-slate-900 mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="font-display text-3xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-sm text-slate-500">{plan.period}</span>
                  </div>

                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                        <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isPrimary ? 'bg-indigo-600' : 'bg-slate-200'
                        }`}>
                          <Check className={`w-3 h-3 ${isPrimary ? 'text-white' : 'text-slate-500'}`} />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                      isPrimary
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : plan.name === 'Free'
                          ? 'bg-slate-100 text-slate-400 cursor-default'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Premium features */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-3">What You Get With Premium</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">Powerful tools designed for travelers who want to get the most from every trip.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PREMIUM_FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 rounded-xl bg-white border border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-display font-bold text-slate-900 mb-1.5 text-sm">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-indigo-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <Crown className="w-8 h-8 mx-auto mb-3 opacity-80" />
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">Start Your Premium Journey</h2>
          <p className="text-indigo-100 text-sm mb-8">Try TripPortier+ risk-free. Cancel anytime.</p>
          <button className="px-7 py-3 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50 transition-colors text-sm">
            Get TripPortier+ -- $29.99/year
          </button>
        </div>
      </section>
    </>
  )
}
