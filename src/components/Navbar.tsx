'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Smartphone, Wifi, Car, FileText, User } from 'lucide-react'

const NAV_LINKS = [
  { href: '/esim', label: 'eSIM', icon: Wifi },
  { href: '/transport', label: 'Transport', icon: Car },
  { href: '/visa', label: 'Visa Check', icon: FileText },
  { href: '/app', label: 'Get the App', icon: Smartphone },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/assets/images/logo.png" alt="TripPortier" width={28} height={28} className="rounded-lg" />
            <span className="font-display font-bold text-lg text-slate-900">Trip<span className="text-indigo-600">Portier</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* Auth + mobile */}
          <div className="flex items-center gap-2">
            <Link href="/account" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              <User className="w-4 h-4" />
              Sign In
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1 animate-fade-up">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600">
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          <Link href="/account" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 px-3 py-3 mt-2 bg-indigo-600 text-white rounded-xl text-sm font-medium">
            <User className="w-4 h-4" />
            Sign In
          </Link>
        </div>
      )}
    </nav>
  )
}
