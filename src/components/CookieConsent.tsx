'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Script from 'next/script'

const GA_ID = 'G-X9D9LXQY9Y'
const CONSENT_KEY = 'cookie_consent'

export function CookieConsent() {
  const [show, setShow] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)

  useEffect(() => {
    // Respect DNT
    const dnt = navigator.doNotTrack === '1' || (window as unknown as Record<string, string>).doNotTrack === '1'
    if (dnt) return

    const consent = localStorage.getItem(CONSENT_KEY)
    if (!consent) {
      setShow(true)
    } else {
      try {
        const parsed = JSON.parse(consent)
        if (parsed.analytics) setAnalyticsEnabled(true)
      } catch {
        setShow(true)
      }
    }
  }, [])

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ analytics: true, timestamp: Date.now() }))
    setAnalyticsEnabled(true)
    setShow(false)
  }

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ analytics: false, timestamp: Date.now() }))
    setShow(false)
  }

  return (
    <>
      {analyticsEnabled && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
        </>
      )}

      {show && (
        <div className="fixed bottom-0 inset-x-0 z-50 p-4">
          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 p-5">
            <p className="text-sm text-slate-700 mb-4">
              We use cookies for analytics to improve your experience.{' '}
              <Link href="/privacy" className="text-indigo-600 underline">Privacy Policy</Link>
            </p>
            <div className="flex gap-2">
              <button onClick={accept} className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                Accept
              </button>
              <button onClick={decline} className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
