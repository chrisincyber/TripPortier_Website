'use client'

import { useState } from 'react'
import { ThumbsUp, Lightbulb, Send } from 'lucide-react'

const FEATURES = [
  { id: 1, title: 'Android App', desc: 'Native Android version of TripPortier', votes: 127 },
  { id: 2, title: 'Hotel Booking', desc: 'Compare and book hotels directly in the app', votes: 89 },
  { id: 3, title: 'Travel Insurance', desc: 'Buy travel insurance through TripPortier', votes: 64 },
  { id: 4, title: 'Group Trip Planning', desc: 'Plan trips collaboratively with friends', votes: 56 },
  { id: 5, title: 'Expense Tracker', desc: 'Track spending during your trip', votes: 43 },
  { id: 6, title: 'Dark Mode', desc: 'Dark theme for the website and app', votes: 38 },
]

export default function FeatureRequestPage() {
  const [voted, setVoted] = useState<Set<number>>(new Set())

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-4">
          <Lightbulb className="w-4 h-4" />
          Shape TripPortier
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Feature Requests</h1>
        <p className="text-lg text-slate-600">Vote on features you want to see next. Your voice matters.</p>
      </div>

      <div className="space-y-3">
        {FEATURES.map((f) => (
          <div key={f.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-indigo-200 transition-colors">
            <button
              onClick={() => setVoted((prev) => { const next = new Set(prev); next.has(f.id) ? next.delete(f.id) : next.add(f.id); return next })}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors shrink-0 ${
                voted.has(f.id) ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span className="text-xs font-bold">{f.votes + (voted.has(f.id) ? 1 : 0)}</span>
            </button>
            <div>
              <h3 className="font-display font-bold text-slate-900 text-sm">{f.title}</h3>
              <p className="text-xs text-slate-500">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
        <h3 className="font-display font-bold text-slate-900 mb-2">Have a new idea?</h3>
        <p className="text-sm text-slate-600 mb-4">Share your feature request with us directly.</p>
        <a href="mailto:hello@tripportier.com?subject=Feature%20Request" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium text-sm rounded-xl hover:bg-indigo-700 transition-colors">
          <Send className="w-4 h-4" />
          Submit Idea
        </a>
      </div>
    </div>
  )
}
