'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Wifi, Car, FileText, Crown, User, ChevronDown, Globe, MapPin } from 'lucide-react'
import { CurrencySelector } from '@/components/CurrencySelector'

const ESIM_SUBMENU = [
  { href: '/esim', label: 'Browse Countries', icon: MapPin },
  { href: '/esim/region', label: 'Regional Plans', icon: Globe },
  { href: '/esim/global', label: 'Worldwide', icon: Wifi },
]

const NAV_LINKS = [
  { href: '/esim', label: 'eSIM', icon: Wifi, hasSubmenu: true },
  { href: '/transport', label: 'Transport', icon: Car },
  { href: '/visa', label: 'Visa', icon: FileText },
  { href: '/premium', label: 'Premium', icon: Crown },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [esimOpen, setEsimOpen] = useState(false)
  const [mobileEsimOpen, setMobileEsimOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b transition-shadow duration-300 ${scrolled ? 'border-slate-200 shadow-sm' : 'border-slate-100 shadow-none'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image src="/assets/images/logo.png" alt="TripPortier" width={28} height={28} className="rounded-lg" />
            <span className="font-display font-bold text-lg text-slate-900">Trip<span className="text-indigo-600">Portier</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon, hasSubmenu }) =>
              hasSubmenu ? (
                <div
                  key={href}
                  className="relative"
                  onMouseEnter={() => setEsimOpen(true)}
                  onMouseLeave={() => setEsimOpen(false)}
                >
                  <Link
                    href={href}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                    <ChevronDown className="w-3 h-3 ml-0.5" />
                  </Link>
                  {esimOpen && (
                    <div className="absolute top-full left-0 mt-0 pt-1 w-48">
                      <div className="bg-white rounded-xl border border-slate-200 shadow-lg py-1.5 overflow-hidden">
                        {ESIM_SUBMENU.map(({ href: subHref, label: subLabel, icon: SubIcon }) => (
                          <Link
                            key={subHref}
                            href={subHref}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70 transition-colors"
                          >
                            <SubIcon className="w-4 h-4" />
                            {subLabel}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              )
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:block">
              <CurrencySelector />
            </div>
            <Link
              href="/account"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <User className="w-4 h-4" />
              Sign In
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1 animate-fade-up">
          {NAV_LINKS.map(({ href, label, icon: Icon, hasSubmenu }) =>
            hasSubmenu ? (
              <div key={href}>
                <button
                  onClick={() => setMobileEsimOpen(!mobileEsimOpen)}
                  className="w-full flex items-center justify-between gap-2.5 px-3 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    {label}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileEsimOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileEsimOpen && (
                  <div className="ml-6 space-y-0.5">
                    {ESIM_SUBMENU.map(({ href: subHref, label: subLabel, icon: SubIcon }) => (
                      <Link
                        key={subHref}
                        href={subHref}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <SubIcon className="w-4 h-4" />
                        {subLabel}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            )
          )}
          <div className="px-3 py-2">
            <CurrencySelector />
          </div>
          <Link
            href="/account"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center gap-2 px-3 py-3 mt-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <User className="w-4 h-4" />
            Sign In
          </Link>
        </div>
      )}
    </nav>
  )
}
