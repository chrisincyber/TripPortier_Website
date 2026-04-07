import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions',
  description: 'Find answers to common questions about TripPortier, eSIM plans, airport transfers, subscriptions, and more.',
  openGraph: {
    title: 'FAQ | TripPortier',
    description: 'Everything you need to know about TripPortier.',
  },
}

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children
}
