import type { Metadata } from 'next'
import { FileText, Globe, Clock, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Visa Requirements Check',
  description: 'Instantly check if you need a visa for your destination. Get detailed requirements for your passport.',
}

export default function VisaPage() {
  return (
    <>
      <section className="relative bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 text-white py-20 sm:py-28">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-sm mb-6">
            <FileText className="w-4 h-4" />
            Free Tool
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Visa Requirements{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Check</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
            Instantly check if you need a visa for your destination. Get detailed requirements and apply online in minutes.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2">Check Visa Requirements</h2>
            <p className="text-sm text-slate-600 mb-6">Select your passport country and destination to see visa requirements.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Your Passport</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none">
                  <option>Select your passport country...</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Destination</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none">
                  <option>Select destination...</option>
                </select>
              </div>
              <button className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors">
                Check Requirements
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { icon: Globe, title: '195 Countries', desc: 'Coverage for every country in the world' },
              { icon: Clock, title: 'Instant Results', desc: 'Get visa requirements in seconds' },
              { icon: Shield, title: 'Up to Date', desc: 'Regularly updated requirements' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title}>
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-display font-bold text-slate-900 mb-1">{title}</h3>
                <p className="text-sm text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
