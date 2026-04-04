import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Attributions',
  description: 'Third-party services and open-source credits used by TripPortier.',
}

const ATTRIBUTIONS = [
  { name: 'Supabase', url: 'https://supabase.com', desc: 'Backend infrastructure, authentication, and database' },
  { name: 'Stripe', url: 'https://stripe.com', desc: 'Payment processing' },
  { name: 'Airalo', url: 'https://airalo.com', desc: 'eSIM data plans and provisioning' },
  { name: 'FlightAware', url: 'https://flightaware.com', desc: 'Real-time flight tracking data' },
  { name: 'Google Gemini', url: 'https://ai.google.dev', desc: 'AI-powered trip planning' },
  { name: '12Go Asia', url: 'https://12go.asia', desc: 'Asia transport booking' },
  { name: 'WelcomeTransfers', url: 'https://welcometransfers.com', desc: 'Airport transfer services' },
  { name: 'Lucide Icons', url: 'https://lucide.dev', desc: 'Open-source icon library' },
  { name: 'Next.js', url: 'https://nextjs.org', desc: 'React framework' },
  { name: 'Tailwind CSS', url: 'https://tailwindcss.com', desc: 'Utility-first CSS framework' },
]

export default function AttributionsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">Attributions</h1>
      <p className="text-sm text-slate-500 mb-10">Third-party services and open-source projects that power TripPortier.</p>

      <div className="space-y-3">
        {ATTRIBUTIONS.map((a) => (
          <a
            key={a.name}
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-sm transition-all"
          >
            <div>
              <h3 className="font-display font-bold text-sm text-slate-900">{a.name}</h3>
              <p className="text-xs text-slate-500">{a.desc}</p>
            </div>
            <span className="text-xs text-indigo-500 shrink-0 ml-4">Visit</span>
          </a>
        ))}
      </div>
    </div>
  )
}
