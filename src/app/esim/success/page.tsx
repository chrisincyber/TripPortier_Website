'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { CheckCircle, Mail, Smartphone, Clock, Wifi, ArrowRight } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const plan = searchParams.get('plan')
  const email = searchParams.get('email')

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Celebration header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          You're all set!
        </h1>
        <p className="text-slate-600">Your eSIM purchase was successful.</p>
      </div>

      {/* Email delivery card */}
      <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 mb-4">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-slate-900">Check your email for the QR code</p>
            {email && <p className="text-xs text-slate-600 mt-0.5">Sent to: {email}</p>}
            <div className="flex items-center gap-1.5 mt-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <p className="text-xs text-indigo-700">Typically arrives within 2 minutes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order details */}
      {(orderId || plan) && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4 text-left">
          <h3 className="font-display font-bold text-slate-900 text-sm mb-2">Order Details</h3>
          {orderId && (
            <div className="flex justify-between text-sm py-1">
              <span className="text-slate-500">Order ID</span>
              <span className="font-medium text-slate-900">{orderId}</span>
            </div>
          )}
          {plan && (
            <div className="flex justify-between text-sm py-1">
              <span className="text-slate-500">Plan</span>
              <span className="font-medium text-slate-900">{plan}</span>
            </div>
          )}
        </div>
      )}

      {/* Installation guide */}
      <div className="rounded-xl border border-slate-200 overflow-hidden mb-4">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
          <h3 className="font-display font-bold text-slate-900 text-sm flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-indigo-600" />
            How to install your eSIM
          </h3>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-1">iPhone</p>
            <p className="text-xs text-slate-500">Settings &gt; Mobile Data &gt; Add eSIM &gt; Scan QR code from email</p>
          </div>
          <div className="h-px bg-slate-100" />
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-1">Android</p>
            <p className="text-xs text-slate-500">Settings &gt; Connections &gt; SIM Manager &gt; Add eSIM &gt; Scan QR code</p>
          </div>
        </div>
      </div>

      {/* Activation tip */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-2.5">
        <Wifi className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs text-amber-800">
            <strong>When does my data start?</strong> Install the eSIM now, but your data plan only starts counting when you connect to a network at your destination.
          </p>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/myesims"
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white font-medium text-sm rounded-xl hover:bg-indigo-700 transition-colors"
        >
          View My eSIMs
        </Link>
        <Link
          href="/esim"
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 border border-slate-200 text-slate-700 font-medium text-sm rounded-xl hover:bg-slate-50 transition-colors"
        >
          Browse More Plans <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}

export default function EsimSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-lg mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto mb-5 animate-pulse" />
          <div className="h-8 bg-slate-100 rounded w-48 mx-auto mb-3 animate-pulse" />
          <div className="h-4 bg-slate-100 rounded w-64 mx-auto animate-pulse" />
        </div>
        <div className="h-20 bg-slate-100 rounded-xl mb-4 animate-pulse" />
        <div className="h-32 bg-slate-100 rounded-xl mb-4 animate-pulse" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
