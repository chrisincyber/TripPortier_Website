import Link from 'next/link'
import { Star } from 'lucide-react'

const FOOTER_SECTIONS = [
  {
    title: 'Services',
    links: [
      { label: 'eSIM', href: '/esim' },
      { label: 'Airport Transfers', href: '/airport-transfers' },
      { label: 'Visa Check', href: '/visa' },
      { label: 'Asia Transport', href: 'https://asiatransport.tripportier.com', external: true },
      { label: 'Download App', href: 'https://apps.apple.com/app/tripportier', external: true },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Request Feature', href: '/feature-request' },
      { label: 'Contact Us', href: 'https://wa.me/41765125678', external: true },
      { label: 'Rate us on Trustpilot', href: 'https://www.trustpilot.com/review/tripportier.com', external: true, trustpilot: true },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Attributions', href: '/attributions' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative bg-slate-950 text-white">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h4 className="font-display font-bold text-xl mb-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              TripPortier
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Your smart travel companion for stress-free trips.
            </p>
            <p className="text-xs text-slate-500 italic">
              Built for travelers, by travelers.
            </p>

            {/* Social links placeholder */}
            <div className="flex items-center gap-3 mt-5">
              {['X', 'IG', 'TT', 'YT'].map((platform) => (
                <span
                  key={platform}
                  className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.06] flex items-center justify-center text-xs text-slate-500 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>

          {/* Link sections */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="font-display font-bold text-sm mb-4 text-white/90">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm transition-colors inline-flex items-center gap-1.5 ${
                          (link as { trustpilot?: boolean }).trustpilot
                            ? 'text-emerald-400 hover:text-emerald-300'
                            : 'text-slate-400 hover:text-indigo-400'
                        }`}
                      >
                        {(link as { trustpilot?: boolean }).trustpilot && <Star className="w-3.5 h-3.5 fill-current" />}
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} TripPortier. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>We accept:</span>
              <span className="font-medium text-slate-400">Visa, Mastercard, Amex, PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
