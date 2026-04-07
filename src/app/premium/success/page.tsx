import Link from 'next/link'
import type { Metadata } from 'next'
import { PartyPopper, CheckCircle, Crown, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Welcome to TripPortier+!',
  description: 'Your premium subscription is active. Enjoy all the benefits of TripPortier+.',
}

const UNLOCKED_FEATURES = [
  'Unlimited trip planning with AI',
  'Priority customer support',
  'Exclusive deals on eSIMs and transfers',
  'Ad-free experience across all pages',
  'Early access to new features',
  'Multi-trip management dashboard',
]

export default function PremiumSuccessPage() {
  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 text-center">
      <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
        <PartyPopper className="w-8 h-8 text-amber-600" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold mb-4">
        <Crown className="w-3.5 h-3.5" />
        Premium Active
      </div>

      <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
        Welcome to TripPortier+!
      </h1>

      <p className="text-lg text-slate-600 mb-10">
        Your subscription is active. Here is what you have unlocked:
      </p>

      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 text-left">
        <h3 className="font-display font-bold text-slate-900 text-sm mb-4">Unlocked Features</h3>
        <ul className="space-y-3">
          {UNLOCKED_FEATURES.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-sm text-slate-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href="/account"
        className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-semibold text-sm rounded-xl hover:bg-amber-600 transition-colors"
      >
        Go to Your Account
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
