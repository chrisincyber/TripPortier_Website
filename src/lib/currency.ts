'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

const STORAGE_KEY = 'tripportier_currency'
const COOKIE_KEY = 'tp_currency'
const FX_BUFFER = 1.03

/**
 * Round converted prices to clean psychological pricing points.
 * Always rounds UP to ensure we never lose money.
 */
function roundPrice(amount: number, code: string): number {
  switch (code) {
    case 'USD':
      return amount

    // Zero-decimal: round up to nearest 100
    case 'JPY':
      return Math.ceil(amount / 100) * 100

    // Zero-decimal or large: round up to nearest 1000
    case 'KRW':
    case 'IDR':
      return Math.ceil(amount / 1000) * 1000

    // Round up to nearest 10
    case 'THB':
    case 'INR':
    case 'TWD':
    case 'CZK':
    case 'PHP':
      return Math.ceil(amount / 10) * 10

    // Decimal currencies: round up to .49 or .99
    default: {
      const whole = Math.floor(amount)
      const decimal = amount - whole
      if (decimal <= 0) return whole + 0.49
      if (decimal <= 0.49) return whole + 0.49
      return whole + 0.99
    }
  }
}

export interface CurrencyInfo {
  code: string
  symbol: string
  rate: number
  stripeCode: string
  zeroDecimal: boolean
}

export const CURRENCIES: CurrencyInfo[] = [
  // Major
  { code: 'USD', symbol: '$', rate: 1, stripeCode: 'usd', zeroDecimal: false },
  { code: 'EUR', symbol: '\u20AC', rate: 0.92, stripeCode: 'eur', zeroDecimal: false },
  { code: 'GBP', symbol: '\u00A3', rate: 0.79, stripeCode: 'gbp', zeroDecimal: false },
  { code: 'CHF', symbol: 'CHF', rate: 0.88, stripeCode: 'chf', zeroDecimal: false },
  // Asia-Pacific
  { code: 'JPY', symbol: '\u00A5', rate: 154.5, stripeCode: 'jpy', zeroDecimal: true },
  { code: 'KRW', symbol: '\u20A9', rate: 1340, stripeCode: 'krw', zeroDecimal: true },
  { code: 'SGD', symbol: 'S$', rate: 1.34, stripeCode: 'sgd', zeroDecimal: false },
  { code: 'AUD', symbol: 'A$', rate: 1.55, stripeCode: 'aud', zeroDecimal: false },
  { code: 'NZD', symbol: 'NZ$', rate: 1.72, stripeCode: 'nzd', zeroDecimal: false },
  { code: 'HKD', symbol: 'HK$', rate: 7.82, stripeCode: 'hkd', zeroDecimal: false },
  { code: 'TWD', symbol: 'NT$', rate: 32.2, stripeCode: 'twd', zeroDecimal: false },
  { code: 'THB', symbol: '\u0E3F', rate: 35.8, stripeCode: 'thb', zeroDecimal: false },
  { code: 'MYR', symbol: 'RM', rate: 4.72, stripeCode: 'myr', zeroDecimal: false },
  { code: 'PHP', symbol: '\u20B1', rate: 56.5, stripeCode: 'php', zeroDecimal: false },
  { code: 'INR', symbol: '\u20B9', rate: 83.5, stripeCode: 'inr', zeroDecimal: false },
  { code: 'IDR', symbol: 'Rp', rate: 15800, stripeCode: 'idr', zeroDecimal: true },
  // Americas
  { code: 'CAD', symbol: 'C$', rate: 1.37, stripeCode: 'cad', zeroDecimal: false },
  { code: 'MXN', symbol: 'MX$', rate: 17.2, stripeCode: 'mxn', zeroDecimal: false },
  { code: 'BRL', symbol: 'R$', rate: 5.05, stripeCode: 'brl', zeroDecimal: false },
  // Nordics
  { code: 'SEK', symbol: 'kr', rate: 10.8, stripeCode: 'sek', zeroDecimal: false },
  { code: 'NOK', symbol: 'kr', rate: 10.9, stripeCode: 'nok', zeroDecimal: false },
  { code: 'DKK', symbol: 'kr', rate: 6.88, stripeCode: 'dkk', zeroDecimal: false },
  // Central Europe
  { code: 'PLN', symbol: 'z\u0142', rate: 4.05, stripeCode: 'pln', zeroDecimal: false },
  { code: 'CZK', symbol: 'K\u010D', rate: 23.4, stripeCode: 'czk', zeroDecimal: false },
  // Middle East
  { code: 'AED', symbol: 'AED', rate: 3.67, stripeCode: 'aed', zeroDecimal: false },
  { code: 'SAR', symbol: 'SAR', rate: 3.75, stripeCode: 'sar', zeroDecimal: false },
  { code: 'ILS', symbol: '\u20AA', rate: 3.65, stripeCode: 'ils', zeroDecimal: false },
  // Africa / Turkey
  { code: 'ZAR', symbol: 'R', rate: 18.5, stripeCode: 'zar', zeroDecimal: false },
  { code: 'TRY', symbol: '\u20BA', rate: 32.5, stripeCode: 'try', zeroDecimal: false },
]

function getCurrencyMap(): Map<string, CurrencyInfo> {
  const map = new Map<string, CurrencyInfo>()
  for (const c of CURRENCIES) map.set(c.code, c)
  return map
}

const currencyMap = getCurrencyMap()

/** Read currency from cookie, then localStorage */
function getStored(): string {
  if (typeof window === 'undefined') return 'USD'
  try {
    // Try cookie first
    const cookies = document.cookie.split(';')
    for (const c of cookies) {
      const [key, val] = c.trim().split('=')
      if (key === COOKIE_KEY && val && currencyMap.has(val)) return val
    }
    // Fall back to localStorage
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && currencyMap.has(stored)) return stored
  } catch {
    // ignore
  }
  return 'USD'
}

/** Save currency to cookie + localStorage */
function saveStored(code: string) {
  try {
    localStorage.setItem(STORAGE_KEY, code)
    document.cookie = `${COOKIE_KEY}=${code};path=/;max-age=31536000;SameSite=Lax`
  } catch {
    // ignore
  }
}

export function useCurrency() {
  const [code, setCode] = useState('USD')

  // Load from cookie/localStorage, then check Supabase
  useEffect(() => {
    const stored = getStored()
    setCode(stored)

    // If logged in, fetch preferred_currency from Supabase (overrides local)
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      supabase
        .from('users')
        .select('preferred_currency')
        .eq('id', data.user.id)
        .single()
        .then(({ data: profile }) => {
          if (profile?.preferred_currency && currencyMap.has(profile.preferred_currency)) {
            setCode(profile.preferred_currency)
            saveStored(profile.preferred_currency)
          }
        })
    })
  }, [])

  const info = currencyMap.get(code) || CURRENCIES[0]
  const isUSD = info.code === 'USD'

  const setCurrency = useCallback((newCode: string) => {
    setCode(newCode)
    saveStored(newCode)

    // Sync to Supabase if logged in
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      supabase
        .from('users')
        .upsert({ id: data.user.id, preferred_currency: newCode }, { onConflict: 'id' })
    })

    window.dispatchEvent(new Event('currency-change'))
  }, [])

  useEffect(() => {
    const handler = () => setCode(getStored())
    window.addEventListener('currency-change', handler)
    return () => window.removeEventListener('currency-change', handler)
  }, [])

  const formatPrice = useCallback(
    (usdAmount: number): string => {
      if (isUSD) return `$${usdAmount.toFixed(2)}`
      const converted = usdAmount * info.rate * FX_BUFFER
      const rounded = roundPrice(converted, info.code)
      if (info.zeroDecimal) {
        return `${info.symbol}${rounded.toLocaleString()}`
      }
      return `${info.symbol}${rounded.toFixed(2)}`
    },
    [info, isUSD]
  )

  const getChargeAmount = useCallback(
    (usdAmount: number): { amount: number; currency: string; displayAmount: string } => {
      if (isUSD) {
        return {
          amount: Math.round(usdAmount * 100),
          currency: 'usd',
          displayAmount: `$${usdAmount.toFixed(2)}`,
        }
      }
      const converted = usdAmount * info.rate * FX_BUFFER
      const rounded = roundPrice(converted, info.code)
      if (info.zeroDecimal) {
        return {
          amount: rounded,
          currency: info.stripeCode,
          displayAmount: `${info.symbol}${rounded.toLocaleString()}`,
        }
      }
      const amount = Math.round(rounded * 100)
      return {
        amount,
        currency: info.stripeCode,
        displayAmount: `${info.symbol}${rounded.toFixed(2)}`,
      }
    },
    [info, isUSD]
  )

  const formatUSD = useCallback((usdAmount: number): string => {
    return `$${usdAmount.toFixed(2)}`
  }, [])

  return {
    currency: info,
    symbol: info.symbol,
    code: info.code,
    isUSD,
    setCurrency,
    formatPrice,
    formatUSD,
    getChargeAmount,
  }
}
