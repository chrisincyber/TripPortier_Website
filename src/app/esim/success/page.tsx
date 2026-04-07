'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { CheckCircle, Mail, ArrowLeft } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const plan = searchParams.get('plan')

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-8 h-8 text-emerald-600" />
      </div>

      <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
        Your eSIM is on its way!
      </h1>

      <p className="text-lg text-slate-600 mb-2">
        Thank you for your purchase.
      </p>

      <div className="flex items-center justify-center gap-2 text-slate-500 mb-8">
        <Mail className="w-4 h-4" />
        <p className="text-sm">Check your email for the QR code to activate your eSIM.</p>
      </div>

      {(orderId || plan) && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 mb-8 text-left">
          <h3 className="font-display font-bold text-slate-900 text-sm mb-3">Order Details</h3>
          {orderId && (
            <div className="flex justify-between text-sm py-1.5">
              <span className="text-slate-500">Order ID</span>
              <span className="font-medium text-slate-900">{orderId}</span>
            </div>
          )}
          {plan && (
            <div className="flex justify-between text-sm py-1.5">
              <span className="text-slate-500">Plan</span>
              <span className="font-medium text-slate-900">{plan}</span>
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
          <strong>Tip:</strong> Install the eSIM before you travel. You can activate it when you arrive at your destination.
        </div>

        <Link
          href="/esim"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-medium text-sm rounded-xl hover:bg-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to eSIM Plans
        </Link>
      </div>
    </div>
  )
}

export default function EsimSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto mb-6 animate-pulse" />
        <div className="h-8 bg-slate-100 rounded w-3/4 mx-auto mb-3 animate-pulse" />
        <div className="h-4 bg-slate-100 rounded w-1/2 mx-auto animate-pulse" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
