'use client'

import { useCurrency, CURRENCIES } from '@/lib/currency'

export function CurrencySelector() {
  const { code, setCurrency } = useCurrency()

  return (
    <select
      value={code}
      onChange={(e) => setCurrency(e.target.value)}
      className="px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 bg-white hover:border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors cursor-pointer"
      aria-label="Select currency"
    >
      {CURRENCIES.map((c) => (
        <option key={c.code} value={c.code}>
          {c.symbol} {c.code}
        </option>
      ))}
    </select>
  )
}
