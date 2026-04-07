'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { label: 'Countries', href: '/esim' },
  { label: 'Regions', href: '/esim/region' },
  { label: 'Worldwide', href: '/esim/global' },
]

export function EsimTabs() {
  const pathname = usePathname()

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex gap-1 -mb-px" aria-label="eSIM navigation">
          {TABS.map(({ label, href }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
