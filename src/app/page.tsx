'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import {
  ArrowRight, Globe, Shield, Zap, Star, Lock,
  DollarSign, Puzzle, Wifi, Car, FileCheck, MapPin,
  Smartphone, Search, CheckCircle, Sparkles, Users, CreditCard,
} from 'lucide-react'
import { CountrySearch } from '@/components/CountrySearch'

/* ───────────────────────── Data ───────────────────────── */

const SEARCH_TABS = [
  { key: 'esim', label: 'eSIM', icon: Wifi },
  { key: 'transfers', label: 'Transfers', icon: Car },
  { key: 'visa', label: 'Visa Check', icon: FileCheck },
] as const

const DESTINATIONS = [
  { name: 'Japan', flag: '\u{1F1EF}\u{1F1F5}', price: '$4.50', code: 'JP', trending: true },
  { name: 'Thailand', flag: '\u{1F1F9}\u{1F1ED}', price: '$4.50', code: 'TH', trending: true },
  { name: 'South Korea', flag: '\u{1F1F0}\u{1F1F7}', price: '$5.00', code: 'KR' },
  { name: 'USA', flag: '\u{1F1FA}\u{1F1F8}', price: '$5.00', code: 'US' },
  { name: 'UK', flag: '\u{1F1EC}\u{1F1E7}', price: '$4.50', code: 'GB' },
  { name: 'Singapore', flag: '\u{1F1F8}\u{1F1EC}', price: '$5.00', code: 'SG' },
  { name: 'Australia', flag: '\u{1F1E6}\u{1F1FA}', price: '$6.00', code: 'AU' },
  { name: 'Turkey', flag: '\u{1F1F9}\u{1F1F7}', price: '$4.50', code: 'TR' },
]

const WHY_ITEMS = [
  { icon: Puzzle, title: 'All-in-One Platform', desc: 'eSIM, transfers, transport, and visa check. Stop juggling five different apps.', color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100' },
  { icon: DollarSign, title: 'Save Up to 90%', desc: 'Transparent pricing with no hidden fees. Way cheaper than airport roaming.', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { icon: Zap, title: 'Instant Activation', desc: 'eSIM activates before you land. Transfer confirmed in seconds. No waiting.', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
  { icon: Shield, title: 'Secure Payments', desc: 'Bank-level encryption. Money-back guarantee. Your data stays private.', color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-100' },
]

const HOW_IT_WORKS = [
  { step: '1', title: 'Search', desc: 'Pick your destination and find what you need in seconds.', icon: Search },
  { step: '2', title: 'Book', desc: 'Secure checkout with instant confirmation. No hidden fees.', icon: CreditCard },
  { step: '3', title: 'Travel', desc: 'eSIM works on landing, driver at arrivals, visa sorted.', icon: MapPin },
]

const SERVICES = [
  { icon: Wifi, title: 'eSIM Data Plans', desc: 'Instant mobile data in 200+ countries. Save up to 90% vs roaming.', href: '/esim', label: 'Browse plans', accent: 'indigo' },
  { icon: Car, title: 'Airport Transfers', desc: 'Your driver is waiting when you land. Fixed price, no surprises.', href: '/airport-transfers', label: 'Book transfer', accent: 'emerald' },
  { icon: Globe, title: 'Asia Transport', desc: 'Trains, buses, and ferries across Southeast Asia.', href: 'https://asiatransport.tripportier.com', label: 'Explore routes', accent: 'amber' },
  { icon: FileCheck, title: 'Visa Check', desc: 'Check requirements in seconds for any passport.', href: '/visa', label: 'Check now', accent: 'violet' },
]

const ACCENT_MAP: Record<string, { gradient: string; glow: string; borderHover: string; iconBg: string; text: string }> = {
  indigo: { gradient: 'from-indigo-500 to-indigo-600', glow: 'group-hover:shadow-indigo-500/20', borderHover: 'group-hover:border-indigo-300', iconBg: 'bg-indigo-50', text: 'text-indigo-600' },
  emerald: { gradient: 'from-emerald-500 to-emerald-600', glow: 'group-hover:shadow-emerald-500/20', borderHover: 'group-hover:border-emerald-300', iconBg: 'bg-emerald-50', text: 'text-emerald-600' },
  amber: { gradient: 'from-amber-500 to-amber-600', glow: 'group-hover:shadow-amber-500/20', borderHover: 'group-hover:border-amber-300', iconBg: 'bg-amber-50', text: 'text-amber-600' },
  violet: { gradient: 'from-violet-500 to-violet-600', glow: 'group-hover:shadow-violet-500/20', borderHover: 'group-hover:border-violet-300', iconBg: 'bg-violet-50', text: 'text-violet-600' },
}

/* ───────────────────────── Helpers ───────────────────────── */

const sectionFade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

/* ───────────────────────── Component ───────────────────────── */

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('esim')

  return (
    <>
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative min-h-[92dvh] flex items-center justify-center overflow-hidden">
        {/* Gradient background - lighter, not too dark */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Glow orbs */}
        <div className="absolute top-1/4 -left-32 w-80 h-80 bg-indigo-500/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-violet-500/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-[180px]" />

        <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center text-white">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-3"
          >
            Where are you traveling?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base sm:text-lg text-white/60 mb-8 max-w-lg mx-auto"
          >
            eSIM, airport transfers, and visa check -all in one place.
          </motion.p>

          {/* Booking Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-10"
          >
            <div className="relative rounded-2xl glow">
              <div className="relative bg-white/[0.07] backdrop-blur-xl rounded-2xl border border-white/[0.12]">
                {/* Tabs */}
                <div className="flex border-b border-white/10">
                  {SEARCH_TABS.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all relative ${
                          activeTab === tab.key
                            ? 'text-white'
                            : 'text-white/45 hover:text-white/70'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                        {activeTab === tab.key && (
                          <motion.div
                            layoutId="tab-indicator"
                            className="absolute bottom-0 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full"
                          />
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Tab Content */}
                <div className="p-5 sm:p-6">
                  {activeTab === 'esim' && (
                    <div className="space-y-3">
                      <p className="text-sm text-white/60 text-left">Where do you need data?</p>
                      <CountrySearch
                        targetPath="/esim"
                        paramName="country"
                        placeholder="Search country (e.g. Japan, Thailand...)"
                        buttonLabel="Find eSIM Plans"
                      />
                    </div>
                  )}
                  {activeTab === 'transfers' && (
                    <div className="space-y-3">
                      <p className="text-sm text-white/60 text-left">Book your airport pickup or drop-off</p>
                      <p className="text-xs text-white/40 text-left">Private cars and shuttles in 150+ countries. Fixed price, no surprises.</p>
                      <Link
                        href="/airport-transfers"
                        className="block w-full py-3.5 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 font-semibold rounded-xl text-sm text-center shadow-lg shadow-indigo-500/25 transition-all"
                      >
                        Search Airport Transfers
                      </Link>
                    </div>
                  )}
                  {activeTab === 'visa' && (
                    <div className="space-y-3">
                      <p className="text-sm text-white/60 text-left">Check visa requirements for your destination</p>
                      <CountrySearch
                        targetPath="/visa"
                        paramName="destination"
                        placeholder="Where are you traveling to?"
                        buttonLabel="Check Visa"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <span className="flex items-center gap-1.5 px-3.5 py-2 bg-white/[0.06] backdrop-blur-sm rounded-full text-xs font-medium text-white/60 border border-white/[0.06]">
              <Users className="w-3.5 h-3.5" /> 50,000+ travelers
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-2 bg-white/[0.06] backdrop-blur-sm rounded-full text-xs font-medium text-white/60 border border-white/[0.06]">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.8/5 rating
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-2 bg-white/[0.06] backdrop-blur-sm rounded-full text-xs font-medium text-white/60 border border-white/[0.06]">
              <Globe className="w-3.5 h-3.5" /> 200+ countries
            </span>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ POPULAR DESTINATIONS ═══════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...sectionFade}>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-2">
              Trending destinations
            </h2>
            <p className="text-center text-slate-500 mb-12 text-sm">
              Get connected before you even land.
            </p>
          </motion.div>

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
                  href={`/esim/${d.code}`}
                  className="relative flex items-center gap-3 p-4 rounded-xl bg-slate-900 text-white hover:shadow-[0_0_30px_rgba(99,102,241,0.25)] hover:ring-1 hover:ring-indigo-500/50 hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  {'trending' in d && d.trending && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-orange-400 text-[10px] font-bold text-slate-900 rounded-full shadow-lg z-10">
                      TRENDING
                    </span>
                  )}
                  <span className="text-2xl group-hover:scale-110 transition-transform">{d.flag}</span>
                  <div>
                    <p className="font-semibold text-sm">{d.name}</p>
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

      {/* ═══════════════════ WHY TRIPPORTIER ═══════════════════ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...sectionFade}>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-2">
              Why TripPortier
            </h2>
            <p className="text-center text-slate-500 mb-12 text-sm max-w-md mx-auto">
              Built by travelers, for travelers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_ITEMS.map(({ icon: Icon, title, desc, color, bg, border }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`text-center p-6 rounded-2xl bg-white border ${border} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group`}
              >
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="font-display font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...sectionFade}>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-14">
              How it works
            </h2>
          </motion.div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Connector line (desktop only) */}
            <div className="hidden md:block absolute top-[56px] left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-[2px] bg-gradient-to-r from-indigo-200 via-violet-300 to-indigo-200" />

            {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-lg transition-shadow"
              >
                <div className="relative w-14 h-14 mx-auto mb-5">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 opacity-75 blur-[2px]" />
                  <div className="absolute inset-[2px] rounded-full bg-white flex items-center justify-center">
                    <Icon className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
                <h3 className="font-display font-bold text-xl text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ SERVICES ═══════════════════ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...sectionFade}>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-2">
              Everything you need to travel smarter
            </h2>
            <p className="text-center text-slate-500 mb-12 text-sm max-w-lg mx-auto">
              From connectivity to transportation, your entire trip is covered.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((s, i) => {
              const a = ACCENT_MAP[s.accent]
              const Icon = s.icon
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={s.href}
                    className={`group relative block p-6 rounded-2xl bg-white border border-slate-200 ${a.borderHover} hover:shadow-xl ${a.glow} hover:-translate-y-1.5 transition-all duration-300`}
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${a.gradient} rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                    <div className={`w-12 h-12 ${a.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${a.text}`} />
                    </div>
                    <h3 className="font-display font-bold text-lg text-slate-900 mb-2">{s.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">{s.desc}</p>
                    <span className={`text-sm font-semibold ${a.text} inline-flex items-center gap-1`}>
                      {s.label} <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════ APP DOWNLOAD ═══════════════════ */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[140px]" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Phone mockup */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="hidden lg:block shrink-0"
            >
              <div className="relative w-44 h-[360px]">
                <Image
                  src="/assets/images/phone-center.png"
                  alt="TripPortier App"
                  fill
                  className="object-contain"
                />
                <div className="absolute inset-0 bg-indigo-500/15 blur-[50px] rounded-full scale-75" />
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">
                Get the <span className="gradient-text">TripPortier App</span>
              </h2>
              <p className="text-slate-400 mb-6 text-sm leading-relaxed max-w-md">
                Smart packing lists, flight tracking, trip sharing, and all your bookings -beautifully organized in one app.
              </p>
              <div className="flex gap-3 justify-center lg:justify-start">
                <a
                  href="https://apps.apple.com/app/tripportier"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors text-sm shadow-lg"
                >
                  <Smartphone className="w-4 h-4" /> Download for iOS
                </a>
                <Link
                  href="/app"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white/[0.08] border border-white/10 font-semibold rounded-xl hover:bg-white/[0.12] transition-colors text-sm"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[length:400%_400%] bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 animate-[gradient-shift_8s_ease_infinite]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
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
