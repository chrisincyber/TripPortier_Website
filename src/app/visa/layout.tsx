import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Visa Requirements Checker - Free Tool',
  description: 'Check visa requirements for any country. Find out if you need a visa, e-visa, or can travel visa-free. Updated regularly.',
  openGraph: {
    title: 'Visa Requirements Checker | TripPortier',
    description: 'Instantly check visa requirements for 195 countries. Free, no signup required.',
  },
}

export default function VisaLayout({ children }: { children: React.ReactNode }) {
  return children
}
