'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'tripportier_currency'

export interface CurrencyInfo {
  code: string
  symbol: string
  rate: number
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'EUR', symbol: '\u20AC', rate: 0.92 },
  { code: 'GBP', symbol: '\u00A3', rate: 0.79 },
  { code: 'CHF', symbol: 'CHF', rate: 0.88 },
  { code: 'JPY', symbol: '\u00A5', rate: 154.5 },
  { code: 'AUD', symbol: 'A$', rate: 1.55 },
  { code: 'CAD', symbol: 'C$', rate: 1.37 },
  { code: 'SGD', symbol: 'S$', rate: 1.34 },
  { code: 'THB', symbol: '\u0E3F', rate: 35.8 },
  { code: 'KRW', symbol: '\u20A9', rate: 1340 },
]

function getCurrencyMap(): Map<string, CurrencyInfo> {
  const map = new Map<string, CurrencyInfo>()
  for (const c of CURRENCIES) map.set(c.code, c)
  return map
}

const currencyMap = getCurrencyMap()

function getStored(): string {
  if (typeof window === 'undefined') return 'USD'
  try {
    return localStorage.getItem(STORAGE_KEY) || 'USD'
  } catch {
    return 'USD'
  }
}

export function useCurrency() {
  const [code, setCode] = useState('USD')

  useEffect(() => {
    setCode(getStored())
  }, [])

  const info = currencyMap.get(code) || CURRENCIES[0]

  const setCurrency = useCallback((newCode: string) => {
    setCode(newCode)
    try {
      localStorage.setItem(STORAGE_KEY, newCode)
    } catch {
      // ignore
    }
    // dispatch event so other components can sync
    window.dispatchEvent(new Event('currency-change'))
  }, [])

  useEffect(() => {
    const handler = () => setCode(getStored())
    window.addEventListener('currency-change', handler)
    return () => window.removeEventListener('currency-change', handler)
  }, [])

  const formatPrice = useCallback(
    (usdAmount: number): string => {
      const converted = usdAmount * info.rate
      // For JPY and KRW, no decimals
      if (info.code === 'JPY' || info.code === 'KRW') {
        return `${info.symbol}${Math.round(converted).toLocaleString()}`
      }
      return `${info.symbol}${converted.toFixed(2)}`
    },
    [info]
  )

  return {
    currency: info,
    symbol: info.symbol,
    code: info.code,
    setCurrency,
    formatPrice,
  }
}
