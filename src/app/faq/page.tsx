'use client'

import { useState } from 'react'
import { ChevronDown, MessageCircle, Mail, HelpCircle } from 'lucide-react'

const FAQS = [
  {
    q: 'What is TripPortier?',
    a: 'TripPortier is an all-in-one travel companion app that helps you plan and organize your trips. It features smart AI-powered packing lists, real-time flight tracking, eSIM data plans for international travel, weather forecasts, and trip sharing with friends and family.',
  },
  {
    q: 'Is TripPortier free to use?',
    a: 'Yes! TripPortier offers a generous free tier that includes basic packing lists, single-destination trips, and essential features. For power travelers, Trip Plus unlocks multi-destination trips, AI smart suggestions, calendar integration, extended weather forecasts, and more.',
  },
  {
    q: 'What devices is TripPortier available on?',
    a: 'TripPortier is currently available for iOS devices (iPhone and iPad) running iOS 17.6 or later. Download it from the App Store. An Android version is planned for the future.',
  },
  {
    q: 'How do I create an account?',
    a: 'You can create an account using your email address, Google account, or Apple ID. Simply download the app and follow the sign-up process.',
  },
  {
    q: "What's included in Trip Plus?",
    a: 'Trip Plus unlocks premium features including multi-destination trips, AI smart suggestions, calendar integration, extended weather forecasts, priority support, and more.',
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'To cancel your Trip Plus subscription, go to Settings in the app and manage your subscription through your Apple ID settings.',
  },
  {
    q: 'How do I restore my purchases on a new device?',
    a: "Go to Settings in the app and tap 'Restore Purchases'. Make sure you're signed in with the same Apple ID you used for the original purchase.",
  },
  {
    q: 'How do smart packing suggestions work?',
    a: 'Our AI analyzes your trip details including destination, weather forecasts, duration, and activities to generate personalized packing recommendations.',
  },
  {
    q: 'What are eSIMs?',
    a: "eSIMs are digital SIM cards that allow you to get a data plan without a physical SIM card. Just scan the QR code and you're connected instantly in 200+ countries.",
  },
  {
    q: 'How do airport transfers work?',
    a: 'Book a pre-arranged ride from the airport to your hotel. Choose from private cars, shared shuttles, or economy options. Fixed prices with no surprises.',
  },
]

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0f0f23] via-[#1a1a3e] to-[#0f0f23] text-white py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.12),_transparent_60%)]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.1] text-indigo-300 text-sm font-medium mb-6">
            <HelpCircle className="w-3.5 h-3.5" />
            Help Center
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
            Frequently Asked{' '}
            <span className="gradient-text">Questions</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto">
            Everything you need to know about TripPortier. Can&apos;t find what you&apos;re looking for? Reach out to us.
          </p>
        </div>
      </section>

      {/* FAQ accordion */}
      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={`rounded-xl border transition-all ${
                  openIndex === i
                    ? 'border-indigo-200 shadow-sm bg-white'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left group"
                >
                  <span className={`text-sm font-semibold pr-4 transition-colors ${
                    openIndex === i ? 'text-indigo-600' : 'text-slate-900 group-hover:text-indigo-600'
                  }`}>
                    {faq.q}
                  </span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                    openIndex === i
                      ? 'bg-indigo-100 rotate-180'
                      : 'bg-slate-100 group-hover:bg-indigo-50'
                  }`}>
                    <ChevronDown className={`w-4 h-4 transition-colors ${
                      openIndex === i ? 'text-indigo-600' : 'text-slate-400'
                    }`} />
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-200 ease-in-out ${
                    openIndex === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-4">
                      <div className="h-px bg-slate-100 mb-3" />
                      <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-3">Still Have Questions?</h2>
            <p className="text-sm text-slate-500">We are here to help. Reach out and we will get back to you as soon as possible.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="mailto:info@tripportier.com"
              className="group p-5 rounded-xl bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all text-center"
            >
              <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-100 transition-colors">
                <Mail className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-sm mb-1">Email Us</h3>
              <p className="text-xs text-slate-500">info@tripportier.com</p>
            </a>

            <a
              href="/feature-request"
              className="group p-5 rounded-xl bg-white border border-slate-200 hover:border-emerald-200 hover:shadow-md transition-all text-center"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-100 transition-colors">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-sm mb-1">Feature Request</h3>
              <p className="text-xs text-slate-500">Suggest a new feature</p>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
