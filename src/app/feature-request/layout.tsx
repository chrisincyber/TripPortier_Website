import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Feature Requests - Shape TripPortier',
  description: 'Vote on upcoming features and suggest new ideas for TripPortier.',
}

export default function FeatureRequestLayout({ children }: { children: React.ReactNode }) {
  return children
}
