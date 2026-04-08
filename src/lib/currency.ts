'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'tripportier_currency'
const FX_BUFFER = 1.03 // 3% buffer for non-USD to cover Stripe FX fees + rate fluctuation

/**
 * Round converted prices to clean psychological pricing points.
 * Always rounds UP to ensure we never lose money.
 */
function roundPrice(amount: number, code: string): number {
  switch (code) {
    case 'USD':
      return amount // base currency, no rounding

    // Zero-decimal currencies: round up to clean intervals
    case 'JPY':
      return Math.ceil(amount / 100) * 100    // nearest 100 up
    case 'KRW':
      return Math.ceil(amount / 1000) * 1000   // nearest 1000 up

    // THB: round up to nearest 10
    case 'THB':
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
  /** Stripe currency code (lowercase) */
  stripeCode: string
  /** Whether Stripe uses zero-decimal (JPY, KRW) */
  zeroDecimal: boolean
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', symbol: '$', rate: 1, stripeCode: 'usd', zeroDecimal: false },
  { code: 'EUR', symbol: '\u20AC', rate: 0.92, stripeCode: 'eur', zeroDecimal: false },
  { code: 'GBP', symbol: '\u00A3', rate: 0.79, stripeCode: 'gbp', zeroDecimal: false },
  { code: 'CHF', symbol: 'CHF', rate: 0.88, stripeCode: 'chf', zeroDecimal: false },
  { code: 'JPY', symbol: '\u00A5', rate: 154.5, stripeCode: 'jpy', zeroDecimal: true },
  { code: 'AUD', symbol: 'A$', rate: 1.55, stripeCode: 'aud', zeroDecimal: false },
  { code: 'CAD', symbol: 'C$', rate: 1.37, stripeCode: 'cad', zeroDecimal: false },
  { code: 'SGD', symbol: 'S$', rate: 1.34, stripeCode: 'sgd', zeroDecimal: false },
  { code: 'THB', symbol: '\u0E3F', rate: 35.8, stripeCode: 'thb', zeroDecimal: false },
  { code: 'KRW', symbol: '\u20A9', rate: 1340, stripeCode: 'krw', zeroDecimal: true },
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
  const isUSD = info.code === 'USD'

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

  /** Format a USD amount in the selected currency (with FX buffer + psychological rounding for non-USD) */
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

  /** Get the Stripe charge amount in the selected currency (cents/smallest unit) */
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
        displayAmount: `${info.symbol}${converted.toFixed(2)}`,
      }
    },
    [info, isUSD]
  )

  /** Format USD amount as plain "$XX.XX" (no conversion) */
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
