'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useCurrency, CURRENCIES } from '@/lib/currency'

export function CurrencySelector() {
  const { code, setCurrency } = useCurrency()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = CURRENCIES.find(c => c.code === code) || CURRENCIES[0]

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50 transition-all text-xs font-medium text-slate-700 cursor-pointer"
        aria-label="Select currency"
      >
        <span className="text-indigo-600 font-semibold">{current.symbol}</span>
        <span>{current.code}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/50 z-50 py-1 max-h-72 overflow-y-auto">
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              onClick={() => { setCurrency(c.code); setOpen(false) }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors ${
                c.code === code
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className={`w-8 text-right font-semibold text-xs ${c.code === code ? 'text-indigo-600' : 'text-slate-400'}`}>
                {c.symbol}
              </span>
              <span className="font-medium">{c.code}</span>
              {c.code === code && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
