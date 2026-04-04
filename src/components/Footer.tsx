import Link from 'next/link'

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
      { label: 'Review us on Trustpilot', href: 'https://www.trustpilot.com/review/tripportier.com', external: true },
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
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h4 className="font-display font-bold text-lg mb-3">TripPortier</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your smart travel companion for stress-free trips.
            </p>
          </div>

          {/* Link sections */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="font-display font-bold text-sm mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-slate-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
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
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} TripPortier. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>We accept:</span>
            <span className="font-medium">Visa, Mastercard, Amex, PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
