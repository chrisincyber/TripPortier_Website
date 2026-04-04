import type { Metadata } from 'next'
import { Check, Sparkles, Brain, Plane, MapPin, Calendar, Bell } from 'lucide-react'

export const metadata: Metadata = {
  title: 'TripPortier+ Premium',
  description: 'Upgrade to TripPortier+ for AI trip planning, flight tracking, and more premium features.',
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
  { icon: Brain, title: 'AI Trip Planning', desc: 'Get smart itineraries tailored to your travel style and preferences.' },
  { icon: Plane, title: 'Flight Tracking', desc: 'Real-time updates, delays, gate changes, and baggage carousel info.' },
  { icon: Calendar, title: 'Calendar Sync', desc: 'Auto-sync your trip with Apple Calendar or Google Calendar.' },
  { icon: MapPin, title: 'Multi-Destination', desc: 'Plan complex trips with multiple stops and routes.' },
  { icon: Bell, title: 'Smart Alerts', desc: 'Get notified about weather changes, delays, and trip updates.' },
  { icon: Sparkles, title: 'All Future Features', desc: 'Early access to new features as we build them.' },
]

export default function PremiumPage() {
  return (
    <>
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            TripPortier+
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Upgrade Your Travel Experience
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-12">
            AI trip planning, flight tracking, and more. Get the most out of every trip.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`p-6 rounded-2xl border-2 text-left ${
                  plan.primary
                    ? 'border-indigo-500 shadow-xl shadow-indigo-500/10 relative'
                    : 'border-slate-200'
                }`}
              >
                {plan.savings && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-indigo-600 text-white text-xs font-bold rounded-full">
                    {plan.savings}
                  </span>
                )}
                <h3 className="font-display font-bold text-slate-900 mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="font-display text-3xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-sm text-slate-500">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2.5 rounded-xl font-medium text-sm transition-colors ${
                    plan.primary
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-slate-900 text-center mb-10">What You Get</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PREMIUM_FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 rounded-xl bg-white border border-slate-200">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-display font-bold text-slate-900 mb-1">{title}</h3>
                <p className="text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
