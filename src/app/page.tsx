'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Globe, Shield, Zap, Search, Star, Lock, BadgeCheck, DollarSign, CreditCard, Puzzle, Award } from 'lucide-react'

const SEARCH_TABS = [
  { key: 'esim', label: 'eSIM', emoji: '📶' },
  { key: 'transfers', label: 'Transfers', emoji: '🚗' },
  { key: 'transport', label: 'Asia Transport', emoji: '🚂' },
  { key: 'visa', label: 'Visa Check', emoji: '📋' },
]

const DESTINATIONS = [
  { name: 'Japan', flag: '🇯🇵', price: '$4.50', code: 'JP' },
  { name: 'Thailand', flag: '🇹🇭', price: '$4.50', code: 'TH' },
  { name: 'South Korea', flag: '🇰🇷', price: '$5.00', code: 'KR' },
  { name: 'USA', flag: '🇺🇸', price: '$5.00', code: 'US' },
  { name: 'UK', flag: '🇬🇧', price: '$4.50', code: 'GB' },
  { name: 'Singapore', flag: '🇸🇬', price: '$5.00', code: 'SG' },
  { name: 'Australia', flag: '🇦🇺', price: '$6.00', code: 'AU' },
  { name: 'Turkey', flag: '🇹🇷', price: '$4.50', code: 'TR' },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState('esim')

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0f0f23] via-[#1a1a3e] to-[#0f0f23] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.15),_transparent_50%)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            Travel smarter with<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">instant data</span>
          </h1>

          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden mb-6">
            <div className="flex border-b border-white/10">
              {SEARCH_TABS.map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-3 text-xs sm:text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white/80'}`}>
                  <span className="hidden sm:inline">{tab.emoji} </span>{tab.label}
                </button>
              ))}
            </div>
            <div className="p-5">
              {activeTab === 'esim' && (
                <div className="space-y-3">
                  <p className="text-sm text-white/70">Where do you need data?</p>
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-white/10 rounded-xl"><Search className="w-4 h-4 text-white/40" /><span className="text-white/40 text-sm">Search country...</span></div>
                    <Link href="/esim" className="px-5 py-3 bg-indigo-500 hover:bg-indigo-600 font-semibold rounded-xl transition-colors text-sm whitespace-nowrap">Search</Link>
                  </div>
                </div>
              )}
              {activeTab === 'transfers' && (
                <div className="space-y-3">
                  <p className="text-sm text-white/70">Book your airport pickup or drop-off</p>
                  <p className="text-xs text-white/50">Private cars and shuttles in 150+ countries. Fixed price, no surprises.</p>
                  <Link href="/airport-transfers" className="block w-full py-3 bg-indigo-500 hover:bg-indigo-600 font-semibold rounded-xl text-sm text-center">Search Transfers</Link>
                </div>
              )}
              {activeTab === 'transport' && (
                <div className="space-y-3">
                  <p className="text-sm text-white/70">Book trains, buses, and ferries across Asia</p>
                  <a href="https://asiatransport.tripportier.com" target="_blank" rel="noopener noreferrer" className="block w-full py-3 bg-indigo-500 hover:bg-indigo-600 font-semibold rounded-xl text-sm text-center">Search Routes</a>
                </div>
              )}
              {activeTab === 'visa' && (
                <div className="space-y-3">
                  <p className="text-sm text-white/70">Check visa requirements</p>
                  <Link href="/visa" className="block w-full py-3 bg-indigo-500 hover:bg-indigo-600 font-semibold rounded-xl text-sm text-center">Check Requirements</Link>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 text-xs text-white/60 mb-4">
            <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Secure payments</span>
            <span className="flex items-center gap-1"><BadgeCheck className="w-3 h-3" /> Verified provider</span>
            <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> Money-back guarantee</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">50,000+ travelers</span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 4.8/5</span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">200+ countries</span>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-10">Travel planning shouldn&apos;t be this hard</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { e: '💸', t: 'Overpriced roaming', d: 'Carriers charge $10-$20/MB abroad. One scroll could cost more than lunch.' },
              { e: '🚗', t: 'Unreliable pickups', d: 'Hidden fees, no-show drivers, language barriers after a long flight.' },
              { e: '📄', t: 'Visa surprises', d: 'Discovering you need a visa at the airport is a nightmare.' },
              { e: '⏱️', t: 'Too many apps', d: 'SIM apps, transfer sites, visa checkers. Why not all in one place?' },
            ].map(({ e, t, d }) => (
              <div key={t} className="flex items-start gap-3 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-2xl shrink-0">{e}</span>
                <div><h3 className="font-display font-bold text-slate-900 mb-1 text-sm">{t}</h3><p className="text-xs text-slate-600 leading-relaxed">{d}</p></div>
              </div>
            ))}
          </div>
          <p className="text-center text-indigo-600 font-semibold text-sm mt-6">TripPortier solves all of this in one place.</p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-10">Everything you need to travel smarter</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { e: '📱', t: 'eSIM Data Plans', d: 'Instant data in 200+ countries. Save up to 90%.', href: '/esim', l: 'Browse plans' },
              { e: '🚗', t: 'Airport Transfers', d: 'Your driver is waiting when you land. Fixed price.', href: '/airport-transfers', l: 'Book a transfer' },
              { e: '🚂', t: 'Asia Transport', d: 'Trains, buses, ferries across Southeast Asia.', href: 'https://asiatransport.tripportier.com', l: 'Explore routes' },
              { e: '📋', t: 'Visa Check', d: 'Check requirements in seconds for any passport.', href: '/visa', l: 'Check now' },
            ].map((s) => (
              <Link key={s.t} href={s.href} className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1 transition-all">
                <span className="text-3xl mb-4 block">{s.e}</span>
                <h3 className="font-display font-bold text-lg text-slate-900 mb-2">{s.t}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">{s.d}</p>
                <span className="text-sm font-medium text-indigo-600 inline-flex items-center gap-1">{s.l} <ArrowRight className="w-4 h-4" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-10">Popular eSIM destinations</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {DESTINATIONS.map((d) => (
              <Link key={d.code} href={`/esim?country=${d.code}`} className="flex items-center gap-3 p-4 rounded-xl bg-[#0f0f23] text-white hover:ring-2 hover:ring-indigo-500 hover:-translate-y-0.5 hover:shadow-lg transition-all">
                <span className="text-2xl">{d.flag}</span>
                <div><p className="font-medium text-sm">{d.name}</p><p className="text-xs text-indigo-300">from {d.price}</p></div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/esim" className="text-sm font-medium text-indigo-600 inline-flex items-center gap-1">View all 200+ countries <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-10">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: '1', t: 'Search', d: 'Pick your destination and find what you need. Results in seconds.' },
              { n: '2', t: 'Book & Pay', d: 'Secure checkout with instant confirmation. No hidden fees.' },
              { n: '3', t: 'Travel', d: 'eSIM works on landing, driver at arrivals, visa sorted. Done.' },
            ].map(({ n, t, d }) => (
              <div key={n} className="text-center p-6 rounded-2xl bg-white border border-slate-200">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto mb-4 font-bold text-sm">{n}</div>
                <h3 className="font-display font-bold text-lg text-slate-900 mb-2">{t}</h3>
                <p className="text-sm text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why TripPortier */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-10">Why TripPortier</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Puzzle, t: 'All-in-One', d: 'eSIM, transfers, transport, visa, AI planning. No more juggling apps.' },
              { icon: Award, t: 'TripCoins', d: 'Earn coins on every booking. Redeem for discounts.' },
              { icon: Globe, t: '200+ Countries', d: 'From Tokyo to Toronto, we have you covered.' },
              { icon: CreditCard, t: 'Save Money', d: 'Up to 90% cheaper than roaming. Transparent pricing.' },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="text-center p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-4"><Icon className="w-6 h-6 text-indigo-600" /></div>
                <h3 className="font-display font-bold text-slate-900 mb-2">{t}</h3>
                <p className="text-sm text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App CTA */}
      <section className="py-16 bg-gradient-to-br from-[#0f0f23] to-[#1a1a3e] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Download the TripPortier App</h2>
              <p className="text-slate-300 mb-6">Smart packing, flight tracking, trip sharing, and all your bookings in one beautiful app.</p>
              <div className="flex gap-3">
                <a href="https://apps.apple.com/app/tripportier" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors text-sm">Download for iOS</a>
                <Link href="/app" className="px-6 py-3 bg-white/10 border border-white/20 font-semibold rounded-xl hover:bg-white/20 transition-colors text-sm">Learn More</Link>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="relative w-56 h-[440px]"><Image src="/assets/images/phone-center.png" alt="TripPortier App" fill className="object-contain" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Ready to travel smarter?</h2>
          <p className="text-lg text-slate-600 mb-8">Join 50,000+ travelers who save time and money with TripPortier.</p>
          <Link href="/esim" className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg rounded-xl shadow-lg shadow-indigo-600/25">
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  )
}
