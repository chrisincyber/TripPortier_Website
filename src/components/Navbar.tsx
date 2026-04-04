'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Smartphone, Wifi, Car, FileText } from 'lucide-react'

const NAV_LINKS = [
  { href: '/app', label: 'TripPortier App', icon: Smartphone },
  { href: '/esim', label: 'eSIM', icon: Wifi },
  { href: '/transport', label: 'Transport', icon: Car },
  { href: '/visa', label: 'Visa Check', icon: FileText },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/98 backdrop-blur-sm shadow-sm">
      {/* Top row: Logo + Auth */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/assets/images/logo.png" alt="TripPortier" width={32} height={32} className="rounded-lg" />
            <span className="font-display font-bold text-lg text-slate-900">TripPortier</span>
          </Link>

          {/* Desktop auth area placeholder */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/account" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              Sign In
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-slate-600">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main nav row */}
      <div className="hidden md:block border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 h-10">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100">
            <Link href="/account" className="block px-3 py-2.5 text-sm font-medium text-indigo-600">
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
