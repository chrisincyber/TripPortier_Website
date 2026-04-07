import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CookieConsent } from '@/components/CookieConsent'
import { WhatsAppButton } from '@/components/WhatsAppButton'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'TripPortier - eSIM Data Plans, Airport Transfers & Visa Check',
    template: '%s | TripPortier',
  },
  description: 'Book instant eSIM data plans for 200+ countries, airport transfers worldwide, Asia transport tickets, and check visa requirements.',
  keywords: ['travel app', 'esim cards', 'instant esim', 'airport transfer', 'trip planner', 'tripportier'],
  authors: [{ name: 'TripPortier' }],
  metadataBase: new URL('https://tripportier.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'TripPortier',
    title: 'TripPortier - Travel Smarter | eSIM, Transfers & AI Trip Planning',
    description: 'Book instant eSIM cards for 200+ countries, airport transfers, and plan trips with AI.',
    images: [{ url: '/assets/images/og-image.png', width: 1200, height: 630, alt: 'TripPortier' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TripPortier - Travel Smarter',
    images: ['/assets/images/twitter-card.png'],
  },
  icons: { icon: '/assets/images/favicon.png' },
  robots: { index: true, follow: true },
  other: { 'theme-color': '#6366f1' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col antialiased bg-white text-slate-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <CookieConsent />
      </body>
    </html>
  )
}
