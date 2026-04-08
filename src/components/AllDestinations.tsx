'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { BROWSE_REGIONS, getCountriesByBrowseRegion } from '@/lib/countries'

export function AllDestinations() {
  const [openRegion, setOpenRegion] = useState<string | null>(null)

  return (
    <div className="space-y-2">
      {BROWSE_REGIONS.map((region) => {
        const isOpen = openRegion === region.key
        const countries = getCountriesByBrowseRegion(region.key)

        return (
          <div key={region.key} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <button
              onClick={() => setOpenRegion(isOpen ? null : region.key)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{region.emoji}</span>
                <div>
                  <h3 className="font-display font-bold text-slate-900 text-sm">{region.label}</h3>
                  <p className="text-xs text-slate-500">{countries.length} countries</p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="border-t border-slate-100 px-5 py-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {countries.map((c) => (
                    <Link
                      key={c.code}
                      href={`/esim/${c.code}`}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-indigo-50 transition-colors group"
                    >
                      <span className="text-lg" aria-label={c.name}>{c.flag}</span>
                      <span className="text-sm text-slate-700 group-hover:text-indigo-600 transition-colors truncate">{c.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
