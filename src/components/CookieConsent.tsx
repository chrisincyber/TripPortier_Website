'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Script from 'next/script'

const GA_ID = 'G-X9D9LXQY9Y'
const CONSENT_KEY = 'cookie_consent'
const CONSENT_VERSION = 2

interface ConsentState {
  analytics: boolean
  version: number
  timestamp: number
}

export function CookieConsent() {
  const [show, setShow] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)

  const loadConsent = useCallback(() => {
    // Respect Do Not Track
    const dnt =
      navigator.doNotTrack === '1' ||
      (window as unknown as Record<string, string>).doNotTrack === '1'
    if (dnt) {
      // DNT is on: do not track, do not show banner
      return
    }

    const raw = localStorage.getItem(CONSENT_KEY)
    if (!raw) {
      setShow(true)
      return
    }

    try {
      const parsed: ConsentState = JSON.parse(raw)
      // Re-prompt if consent version has changed
      if (!parsed.version || parsed.version < CONSENT_VERSION) {
        setShow(true)
        return
      }
      if (parsed.analytics) setAnalyticsEnabled(true)
    } catch {
      localStorage.removeItem(CONSENT_KEY)
      setShow(true)
    }
  }, [])

  useEffect(() => {
    loadConsent()

    // Listen for "manage cookies" events from other components
    const handler = () => {
      setShow(true)
    }
    window.addEventListener('manage-cookies', handler)
    return () => window.removeEventListener('manage-cookies', handler)
  }, [loadConsent])

  const saveConsent = (analytics: boolean) => {
    const state: ConsentState = {
      analytics,
      version: CONSENT_VERSION,
      timestamp: Date.now(),
    }
    localStorage.setItem(CONSENT_KEY, JSON.stringify(state))
    setAnalyticsEnabled(analytics)
    setShow(false)

    // If revoking consent, remove GA cookies
    if (!analytics) {
      document.cookie.split(';').forEach((c) => {
        const name = c.trim().split('=')[0]
        if (name.startsWith('_ga') || name.startsWith('_gid')) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
        }
      })
    }
  }

  return (
    <>
      {/* Analytics scripts: only loaded after explicit consent */}
      {analyticsEnabled && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
          <Script
            src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
            strategy="lazyOnload"
          />
        </>
      )}

      {/* Cookie consent banner */}
      {show && (
        <div
          className="fixed bottom-0 inset-x-0 z-50 p-4"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 p-5">
            <p className="text-sm text-slate-700 mb-1 font-medium">
              We value your privacy
            </p>
            <p className="text-sm text-slate-600 mb-4">
              We use cookies only for analytics (Google Analytics) to improve
              your experience. No tracking occurs until you consent.{' '}
              <Link
                href="/privacy"
                className="text-indigo-600 underline"
              >
                Privacy Policy
              </Link>{' '}
              &middot;{' '}
              <Link
                href="/privacy#cookies"
                className="text-indigo-600 underline"
              >
                Cookie Policy
              </Link>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => saveConsent(true)}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Accept Analytics
              </button>
              <button
                onClick={() => saveConsent(false)}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
