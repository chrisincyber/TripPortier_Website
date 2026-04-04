'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Metadata } from 'next'

const FAQS = [
  { q: 'What is TripPortier?', a: 'TripPortier is an all-in-one travel companion app that helps you plan and organize your trips. It features smart AI-powered packing lists, real-time flight tracking, eSIM data plans for international travel, weather forecasts, and trip sharing with friends and family.' },
  { q: 'Is TripPortier free to use?', a: 'Yes! TripPortier offers a generous free tier that includes basic packing lists, single-destination trips, and essential features. For power travelers, Trip Plus unlocks multi-destination trips, AI smart suggestions, calendar integration, extended weather forecasts, and more.' },
  { q: 'What devices is TripPortier available on?', a: 'TripPortier is currently available for iOS devices (iPhone and iPad) running iOS 17.6 or later. Download it from the App Store. An Android version is planned for the future.' },
  { q: 'How do I create an account?', a: 'You can create an account using your email address, Google account, or Apple ID. Simply download the app and follow the sign-up process.' },
  { q: "What's included in Trip Plus?", a: 'Trip Plus unlocks premium features including multi-destination trips, AI smart suggestions, calendar integration, extended weather forecasts, priority support, and more.' },
  { q: 'How do I cancel my subscription?', a: 'To cancel your Trip Plus subscription, go to Settings in the app and manage your subscription through your Apple ID settings.' },
  { q: 'How do I restore my purchases on a new device?', a: "Go to Settings in the app and tap 'Restore Purchases'. Make sure you're signed in with the same Apple ID you used for the original purchase." },
  { q: 'How do smart packing suggestions work?', a: 'Our AI analyzes your trip details including destination, weather forecasts, duration, and activities to generate personalized packing recommendations.' },
  { q: 'What are eSIMs?', a: 'eSIMs are digital SIM cards that allow you to get a data plan without a physical SIM card. Just scan the QR code and you\'re connected instantly in 200+ countries.' },
  { q: 'How do airport transfers work?', a: 'Book a pre-arranged ride from the airport to your hotel. Choose from private cars, shared shuttles, or economy options. Fixed prices with no surprises.' },
]

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="text-center mb-12">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-slate-600">
          Everything you need to know about TripPortier
        </p>
      </div>

      <div className="space-y-2">
        {FAQS.map((faq, i) => (
          <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
            >
              <span className="text-sm font-semibold text-slate-900 pr-4">{faq.q}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4">
                <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
