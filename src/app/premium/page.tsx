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
    primary: false,
  },
  {
    name: 'Monthly',
    price: '$4.99',
    period: '/month',
    features: ['Unlimited trips', 'AI smart suggestions', 'Flight tracking', 'Calendar sync', 'Extended weather', 'Priority support'],
    cta: 'Subscribe',
    primary: false,
  },
  {
    name: 'Yearly',
    price: '$29.99',
    period: '/year',
    savings: 'Save 50%',
    features: ['Everything in Monthly', 'AI trip planning', 'Multi-destination', 'Offline mode', 'All future features'],
    cta: 'Best Value',
    primary: true,
  },
]

const PREMIUM_FEATURES = [
  { icon: Brain, title: 'AI Trip Planning', desc: 'Get smart itineraries tailored to your travel style and preferences.', gradient: 'from-violet-400 to-purple-500' },
  { icon: Plane, title: 'Flight Tracking', desc: 'Real-time updates, delays, gate changes, and baggage carousel info.', gradient: 'from-sky-400 to-blue-500' },
  { icon: Calendar, title: 'Calendar Sync', desc: 'Auto-sync your trip with Apple Calendar or Google Calendar.', gradient: 'from-emerald-400 to-teal-500' },
  { icon: MapPin, title: 'Multi-Destination', desc: 'Plan complex trips with multiple stops, routes, and connections.', gradient: 'from-rose-400 to-pink-500' },
  { icon: Bell, title: 'Smart Alerts', desc: 'Get notified about weather changes, delays, and trip updates.', gradient: 'from-amber-400 to-orange-500' },
  { icon: Sparkles, title: 'All Future Features', desc: 'Early access to new features as we build and ship them.', gradient: 'from-indigo-400 to-blue-500' },
]

export default function PremiumPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0f0f23] via-indigo-950/60 to-[#0f0f23] text-white py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.2),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(139,92,246,0.15),_transparent_50%)]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-indigo-300 text-sm font-medium mb-8">
            <Crown className="w-4 h-4" />
            TripPortier+
          </div>

          <h1 className="animate-fade-up font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6" style={{ animationDelay: '0.1s' }}>
            Upgrade Your{' '}
            <span className="gradient-text">Travel Experience</span>
          </h1>

          <p className="animate-fade-up text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto" style={{ animationDelay: '0.2s' }}>
            AI trip planning, real-time flight tracking, and premium features that make every trip better.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="py-20 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto -mt-16">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-7 text-left transition-all duration-300 ${
                  plan.primary
                    ? 'bg-white border-2 border-transparent shadow-2xl shadow-indigo-500/20 hover:shadow-indigo-500/30 scale-[1.02] md:scale-105'
                    : 'bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg'
                }`}
                style={plan.primary ? {
                  backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #818cf8, #a78bfa, #c084fc)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box',
                } : undefined}
              >
                {/* Glow effect for yearly */}
                {plan.primary && (
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-2xl -z-10 blur-sm opacity-40" />
                )}

                {plan.savings && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold rounded-full shadow-lg shadow-indigo-500/30">
                    {plan.savings}
                  </span>
                )}

                <h3 className="font-display font-bold text-slate-900 mb-1 text-lg">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-display text-4xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-sm text-slate-500">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        plan.primary
                          ? 'bg-gradient-to-br from-indigo-500 to-violet-500'
                          : 'bg-slate-200'
                      }`}>
                        <Check className={`w-3 h-3 ${plan.primary ? 'text-white' : 'text-slate-500'}`} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    plan.primary
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5'
                      : plan.name === 'Free'
                        ? 'bg-slate-100 text-slate-500 cursor-default'
                        : 'bg-slate-900 text-white hover:bg-slate-800 hover:-translate-y-0.5'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-4">What You Get With Premium</h2>
            <p className="text-slate-500 max-w-lg mx-auto">Powerful tools designed for travelers who want to get the most from every trip.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PREMIUM_FEATURES.map(({ icon: Icon, title, desc, gradient }) => (
              <div key={title} className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-bold text-slate-900 mb-2 text-lg">{title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 text-white text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.1),_transparent_50%)]" />
        <div className="relative max-w-3xl mx-auto px-4">
          <Crown className="w-10 h-10 mx-auto mb-4 opacity-80" />
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Start Your Premium Journey</h2>
          <p className="text-indigo-100 text-lg mb-10">Try TripPortier+ risk-free. Cancel anytime.</p>
          <button className="px-8 py-4 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-all hover:shadow-lg hover:-translate-y-0.5 shadow-lg">
            Get TripPortier+ — $29.99/year
          </button>
        </div>
      </section>
    </>
  )
}
