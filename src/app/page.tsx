'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import {
  ArrowRight, Globe, Shield, Zap, Search, Star, Lock, BadgeCheck,
  DollarSign, CreditCard, Puzzle, Award, Wifi, Car, FileCheck, MapPin,
  Plane, CheckCircle, AlertTriangle, Sparkles,
} from 'lucide-react'

/* ───────────────────────── Data ───────────────────────── */

const TYPING_WORDS = ['instant data', 'smooth rides', 'visa freedom', 'AI planning']

const SEARCH_TABS = [
  { key: 'esim', label: 'eSIM', emoji: '📶' },
  { key: 'transfers', label: 'Transfers', emoji: '🚗' },
  { key: 'transport', label: 'Asia Transport', emoji: '🚂' },
  { key: 'visa', label: 'Visa Check', emoji: '📋' },
]

const DESTINATIONS = [
  { name: 'Japan', flag: '🇯🇵', price: '$4.50', code: 'JP', trending: true },
  { name: 'Thailand', flag: '🇹🇭', price: '$4.50', code: 'TH', trending: true },
  { name: 'South Korea', flag: '🇰🇷', price: '$5.00', code: 'KR' },
  { name: 'USA', flag: '🇺🇸', price: '$5.00', code: 'US' },
  { name: 'UK', flag: '🇬🇧', price: '$4.50', code: 'GB' },
  { name: 'Singapore', flag: '🇸🇬', price: '$5.00', code: 'SG' },
  { name: 'Australia', flag: '🇦🇺', price: '$6.00', code: 'AU' },
  { name: 'Turkey', flag: '🇹🇷', price: '$4.50', code: 'TR' },
]

const SERVICES = [
  { e: '📱', t: 'eSIM Data Plans', d: 'Instant data in 200+ countries. Save up to 90%.', href: '/esim', l: 'Browse plans', accent: 'from-indigo-500 to-indigo-600', glow: 'group-hover:shadow-indigo-500/25', border: 'group-hover:border-indigo-400/50', iconBg: 'bg-indigo-500/10' },
  { e: '🚗', t: 'Airport Transfers', d: 'Your driver is waiting when you land. Fixed price.', href: '/airport-transfers', l: 'Book a transfer', accent: 'from-emerald-500 to-emerald-600', glow: 'group-hover:shadow-emerald-500/25', border: 'group-hover:border-emerald-400/50', iconBg: 'bg-emerald-500/10' },
  { e: '🚂', t: 'Asia Transport', d: 'Trains, buses, ferries across Southeast Asia.', href: 'https://asiatransport.tripportier.com', l: 'Explore routes', accent: 'from-amber-500 to-amber-600', glow: 'group-hover:shadow-amber-500/25', border: 'group-hover:border-amber-400/50', iconBg: 'bg-amber-500/10' },
  { e: '📋', t: 'Visa Check', d: 'Check requirements in seconds for any passport.', href: '/visa', l: 'Check now', accent: 'from-violet-500 to-violet-600', glow: 'group-hover:shadow-violet-500/25', border: 'group-hover:border-violet-400/50', iconBg: 'bg-violet-500/10' },
]

const PAIN_POINTS = [
  { e: '💸', t: 'Overpriced roaming', d: 'Carriers charge $10-$20/MB abroad. One scroll could cost more than lunch.' },
  { e: '🚗', t: 'Unreliable pickups', d: 'Hidden fees, no-show drivers, language barriers after a long flight.' },
  { e: '📄', t: 'Visa surprises', d: 'Discovering you need a visa at the airport is a nightmare.' },
  { e: '⏱️', t: 'Too many apps', d: 'SIM apps, transfer sites, visa checkers. Why not all in one place?' },
]

const HOW_IT_WORKS = [
  { n: '1', t: 'Search', d: 'Pick your destination and find what you need. Results in seconds.' },
  { n: '2', t: 'Book & Pay', d: 'Secure checkout with instant confirmation. No hidden fees.' },
  { n: '3', t: 'Travel', d: 'eSIM works on landing, driver at arrivals, visa sorted. Done.' },
]

const WHY_ITEMS = [
  { icon: Puzzle, t: 'All-in-One', d: 'eSIM, transfers, transport, visa, AI planning. No more juggling apps.', gradient: 'from-indigo-500/10 to-violet-500/10' },
  { icon: Award, t: 'TripCoins', d: 'Earn coins on every booking. Redeem for discounts.', gradient: 'from-amber-500/10 to-orange-500/10' },
  { icon: Globe, t: '200+ Countries', d: 'From Tokyo to Toronto, we have you covered.', gradient: 'from-emerald-500/10 to-teal-500/10' },
  { icon: CreditCard, t: 'Save Money', d: 'Up to 90% cheaper than roaming. Transparent pricing.', gradient: 'from-pink-500/10 to-rose-500/10' },
]

const FLOATING_CARDS = [
  { text: 'Flight delayed', icon: Plane, pos: 'top-8 -left-16', delay: 0 },
  { text: 'eSIM activated', icon: Wifi, pos: 'top-24 -right-20', delay: 0.5 },
  { text: 'Driver en route', icon: Car, pos: 'bottom-32 -left-20', delay: 1 },
  { text: 'Visa approved', icon: FileCheck, pos: 'bottom-16 -right-16', delay: 1.5 },
]

/* ───────────────────────── Component ───────────────────────── */

export default function Home() {
  const [activeTab, setActiveTab] = useState('esim')
  const [wordIndex, setWordIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  // Typing effect
  useEffect(() => {
    const currentWord = TYPING_WORDS[wordIndex]
    const speed = isDeleting ? 40 : 80

    if (!isDeleting && displayText === currentWord) {
      const timer = setTimeout(() => setIsDeleting(true), 2000)
      return () => clearTimeout(timer)
    }

    if (isDeleting && displayText === '') {
      setIsDeleting(false)
      setWordIndex((prev) => (prev + 1) % TYPING_WORDS.length)
      return
    }

    const timer = setTimeout(() => {
      setDisplayText(
        isDeleting
          ? currentWord.slice(0, displayText.length - 1)
          : currentWord.slice(0, displayText.length + 1)
      )
    }, speed)

    return () => clearTimeout(timer)
  }, [displayText, isDeleting, wordIndex])

  return (
    <>
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[#0a0a1a]">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-[length:400%_400%] bg-gradient-to-br from-[#0f0f23] via-[#1a103a] to-[#0d1f3c] animate-[gradient-shift_15s_ease_infinite]" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating glow orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px] animate-[pulse_10s_ease-in-out_infinite_2s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[200px]" />

        {/* Radial highlight */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.08),_transparent_70%)]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8">
              Travel smarter with
              <br />
              <span className="gradient-text inline-block min-w-[200px]">
                {displayText}
                <span className="animate-[pulse_1s_ease-in-out_infinite] ml-0.5 text-indigo-400">|</span>
              </span>
            </h1>
          </motion.div>

          {/* Glass search widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative rounded-2xl overflow-hidden glow">
              {/* Gradient border effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/30 via-violet-500/30 to-indigo-500/30 p-[1px]" />
              <div className="relative bg-white/[0.06] backdrop-blur-xl rounded-2xl border border-white/10">
                <div className="flex border-b border-white/10">
                  {SEARCH_TABS.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-1 py-3.5 text-xs sm:text-sm font-medium transition-all relative ${
                        activeTab === tab.key
                          ? 'text-white'
                          : 'text-white/50 hover:text-white/80'
                      }`}
                    >
                      {activeTab === tab.key && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full" />
                      )}
                      <span className="hidden sm:inline">{tab.emoji} </span>
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {activeTab === 'esim' && (
                    <div className="space-y-3">
                      <p className="text-sm text-white/70">Where do you need data?</p>
                      <div className="flex gap-2">
                        <div className="flex-1 flex items-center gap-2 px-4 py-3.5 bg-white/[0.06] rounded-xl border border-white/[0.06]">
                          <Search className="w-4 h-4 text-white/40" />
                          <span className="text-white/40 text-sm">Search country...</span>
                        </div>
                        <Link href="/esim" className="px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 font-semibold rounded-xl transition-all text-sm whitespace-nowrap shadow-lg shadow-indigo-500/25">
                          Search
                        </Link>
                      </div>
                    </div>
                  )}
                  {activeTab === 'transfers' && (
                    <div className="space-y-3">
                      <p className="text-sm text-white/70">Book your airport pickup or drop-off</p>
                      <p className="text-xs text-white/50">Private cars and shuttles in 150+ countries. Fixed price, no surprises.</p>
                      <Link href="/airport-transfers" className="block w-full py-3.5 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 font-semibold rounded-xl text-sm text-center shadow-lg shadow-indigo-500/25">
                        Search Transfers
                      </Link>
                    </div>
                  )}
                  {activeTab === 'transport' && (
                    <div className="space-y-3">
                      <p className="text-sm text-white/70">Book trains, buses, and ferries across Asia</p>
                      <a href="https://asiatransport.tripportier.com" target="_blank" rel="noopener noreferrer" className="block w-full py-3.5 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 font-semibold rounded-xl text-sm text-center shadow-lg shadow-indigo-500/25">
                        Search Routes
                      </a>
                    </div>
                  )}
                  {activeTab === 'visa' && (
                    <div className="space-y-3">
                      <p className="text-sm text-white/70">Check visa requirements</p>
                      <Link href="/visa" className="block w-full py-3.5 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 font-semibold rounded-xl text-sm text-center shadow-lg shadow-indigo-500/25">
                        Check Requirements
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="flex flex-wrap justify-center gap-4 text-xs text-white/50 mb-5">
              <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Secure payments</span>
              <span className="flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5" /> Verified provider</span>
              <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> Money-back guarantee</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3.5 py-1.5 bg-white/[0.06] backdrop-blur-sm rounded-full text-xs font-medium text-white/70 border border-white/[0.06]">50,000+ travelers</span>
              <span className="px-3.5 py-1.5 bg-white/[0.06] backdrop-blur-sm rounded-full text-xs font-medium text-white/70 border border-white/[0.06] flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 4.8/5
              </span>
              <span className="px-3.5 py-1.5 bg-white/[0.06] backdrop-blur-sm rounded-full text-xs font-medium text-white/70 border border-white/[0.06]">200+ countries</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 bg-white/40 rounded-full animate-[fade-up_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* ═══════════════════ PAIN POINTS ═══════════════════ */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-12"
          >
            Travel planning shouldn&apos;t be this hard
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {PAIN_POINTS.map(({ e, t, d }, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative flex items-start gap-4 p-5 rounded-2xl bg-red-50/60 border border-red-200/50 group hover:bg-red-50 transition-colors"
              >
                <div className="absolute top-3 right-3">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-300" />
                </div>
                <span className="text-2xl shrink-0">{e}</span>
                <div>
                  <h3 className="font-display font-bold text-slate-900 mb-1 text-sm">{t}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{d}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Solution card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="relative p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/60 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <h3 className="font-display font-bold text-emerald-900 text-lg">TripPortier solves all of this</h3>
            </div>
            <p className="text-sm text-emerald-700">One platform. eSIM, transfers, visa, transport. Everything you need, instantly.</p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ SERVICES ═══════════════════ */}
      <section className="py-20 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-4"
          >
            Everything you need to travel smarter
          </motion.h2>
          <p className="text-center text-slate-500 mb-12 text-sm max-w-lg mx-auto">
            From connectivity to transportation, we have your entire trip covered.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={s.href}
                  className={`group relative block p-6 rounded-2xl bg-white border border-slate-200 ${s.border} hover:shadow-xl ${s.glow} hover:-translate-y-1.5 transition-all duration-300`}
                >
                  {/* Top accent gradient */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${s.accent} rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />

                  <div className={`w-14 h-14 ${s.iconBg} rounded-2xl flex items-center justify-center mb-4`}>
                    <span className="text-3xl">{s.e}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 mb-2">{s.t}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{s.d}</p>
                  <span className={`text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r ${s.accent} inline-flex items-center gap-1`}>
                    {s.l} <ArrowRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ POPULAR DESTINATIONS ═══════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-4"
          >
            Popular eSIM destinations
          </motion.h2>
          <p className="text-center text-slate-500 mb-12 text-sm">Get connected before you even land.</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {DESTINATIONS.map((d, i) => (
              <motion.div
                key={d.code}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/esim?country=${d.code}`}
                  className="relative flex items-center gap-3 p-4 rounded-xl bg-[#0f0f23] text-white hover:shadow-[0_0_25px_rgba(99,102,241,0.3)] hover:ring-2 hover:ring-indigo-500/60 hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  {'trending' in d && d.trending && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-orange-400 text-[10px] font-bold text-slate-900 rounded-full shadow-lg z-10">
                      TRENDING
                    </span>
                  )}
                  <span className="text-2xl group-hover:scale-110 transition-transform">{d.flag}</span>
                  <div>
                    <p className="font-medium text-sm">{d.name}</p>
                    <p className="text-xs text-indigo-300">from {d.price}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/esim" className="text-sm font-semibold text-indigo-600 inline-flex items-center gap-1 hover:gap-2 transition-all">
              View all 200+ countries <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-14"
          >
            How it works
          </motion.h2>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-[52px] left-[calc(16.67%+20px)] right-[calc(16.67%+20px)] h-[2px] bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-300" />

            {HOW_IT_WORKS.map(({ n, t, d }, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center p-8 rounded-2xl bg-white border border-slate-200 hover:shadow-lg transition-shadow"
              >
                {/* Animated gradient circle for step number */}
                <div className="relative w-14 h-14 mx-auto mb-5">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 animate-[spin_6s_linear_infinite] opacity-75 blur-[2px]" />
                  <div className="absolute inset-[2px] rounded-full bg-white flex items-center justify-center">
                    <span className="font-display font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{n}</span>
                  </div>
                </div>
                <h3 className="font-display font-bold text-xl text-slate-900 mb-2">{t}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ WHY TRIPPORTIER ═══════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-4"
          >
            Why TripPortier
          </motion.h2>
          <p className="text-center text-slate-500 mb-12 text-sm max-w-md mx-auto">
            Built by travelers, for travelers. Here&apos;s what makes us different.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_ITEMS.map(({ icon: Icon, t, d, gradient }, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`text-center p-6 rounded-2xl border border-slate-200 bg-gradient-to-br ${gradient} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group`}
              >
                <div className="w-12 h-12 rounded-xl bg-white/80 shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-display font-bold text-slate-900 mb-2">{t}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ APP SHOWCASE ═══════════════════ */}
      <section className="py-20 bg-gradient-to-br from-[#0f0f23] via-[#1a103a] to-[#0d1f3c] text-white relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Download the<br />
                <span className="gradient-text">TripPortier App</span>
              </h2>
              <p className="text-slate-400 mb-8 text-lg leading-relaxed">
                Smart packing, flight tracking, trip sharing, and all your bookings in one beautiful app.
              </p>
              <div className="flex gap-3">
                <a href="https://apps.apple.com/app/tripportier" target="_blank" rel="noopener noreferrer" className="px-6 py-3.5 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors text-sm shadow-lg">
                  Download for iOS
                </a>
                <Link href="/app" className="px-6 py-3.5 bg-white/[0.06] border border-white/10 font-semibold rounded-xl hover:bg-white/10 transition-colors text-sm backdrop-blur-sm">
                  Learn More
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="hidden lg:flex justify-center"
            >
              <div className="relative w-56 h-[440px]">
                <Image src="/assets/images/phone-center.png" alt="TripPortier App" fill className="object-contain relative z-10" />

                {/* Floating UI cards */}
                {FLOATING_CARDS.map((card) => (
                  <motion.div
                    key={card.text}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: card.delay, duration: 0.5 }}
                    className={`absolute ${card.pos} z-20`}
                  >
                    <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-xl rounded-lg border border-white/10 shadow-xl whitespace-nowrap">
                      <card.icon className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-xs font-medium text-white/90">{card.text}</span>
                    </div>
                  </motion.div>
                ))}

                {/* Phone glow */}
                <div className="absolute inset-0 bg-indigo-500/20 blur-[60px] rounded-full scale-75" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section className="relative py-24 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-[length:400%_400%] bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 animate-[gradient-shift_8s_ease_infinite]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-10 h-10 mx-auto mb-6 text-white/80" />
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
              Ready to travel smarter?
            </h2>
            <p className="text-lg text-white/80 mb-10 max-w-md mx-auto">
              Join 50,000+ travelers who save time and money with TripPortier.
            </p>
            <Link
              href="/esim"
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-indigo-700 font-bold text-lg rounded-2xl shadow-2xl shadow-black/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
