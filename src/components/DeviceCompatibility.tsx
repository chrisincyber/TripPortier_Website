'use client'

import { useState } from 'react'
import { Smartphone, Check, AlertTriangle, HelpCircle, ChevronDown } from 'lucide-react'
import { ESIM_DEVICES } from '@/lib/esim-devices'

export function DeviceCompatibility() {
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [showHelp, setShowHelp] = useState(false)

  const selectedBrand = ESIM_DEVICES.find(b => b.name === brand)
  const isCompatible = brand && model ? true : null
  const hasSearched = brand !== '' && model !== ''

  return (
    <div id="compatibility">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
          <Smartphone className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-display text-base font-bold text-slate-900">Is my device compatible?</h3>
          <p className="text-xs text-slate-500">Check if your phone supports eSIM</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* Brand selector */}
        <div className="relative">
          <select
            value={brand}
            onChange={(e) => { setBrand(e.target.value); setModel('') }}
            className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
          >
            <option value="">Select brand...</option>
            {ESIM_DEVICES.map(b => (
              <option key={b.name} value={b.name}>{b.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Model selector */}
        <div className="relative">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={!brand}
            className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value="">{brand ? 'Select model...' : 'Select brand first'}</option>
            {selectedBrand?.models.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Result */}
      {hasSearched && isCompatible && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-900">{brand} {model} supports eSIM</p>
            <p className="text-xs text-emerald-700 mt-0.5">Make sure your device is carrier-unlocked for the best experience.</p>
          </div>
        </div>
      )}

      {/* Not sure / help */}
      <div className="mt-3">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="text-xs text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          My device is not listed
        </button>

        {showHelp && (
          <div className="mt-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 space-y-2">
                <p className="font-semibold">How to check manually:</p>
                <ul className="space-y-1 ml-3 list-disc">
                  <li><strong>iPhone:</strong> Settings &gt; General &gt; About. Look for "Available SIM" or "Digital SIM"</li>
                  <li><strong>Android:</strong> Settings &gt; Connections &gt; SIM Manager. If you see "Add eSIM", your device supports it</li>
                  <li><strong>Alternative:</strong> Dial *#06# to see your device identifiers. If EID is shown, eSIM is supported</li>
                </ul>
                <p className="text-amber-700 mt-2">
                  Your device must also be <strong>carrier-unlocked</strong> to use an eSIM from TripPortier.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
