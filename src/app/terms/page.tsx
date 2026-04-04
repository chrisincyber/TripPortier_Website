import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'TripPortier Terms of Service - Rules and conditions for using our platform.',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">Terms of Service</h1>
      <p className="text-sm text-slate-500 mb-10">Last updated: January 30, 2025</p>

      <div className="space-y-8 text-sm text-slate-700 leading-relaxed [&_h2]:font-display [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mb-3 [&_ul]:space-y-1.5 [&_ul]:list-disc [&_ul]:pl-5">
        <p>Welcome to TripPortier. By using our services, you agree to these terms.</p>

        <section><h2>1. Services</h2>
          <p>TripPortier provides travel planning tools including eSIM data plans, airport transfers, visa checking, flight tracking, and AI-powered trip planning via our website and iOS app.</p>
        </section>

        <section><h2>2. Account Registration</h2>
          <p>You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials. You must be at least 16 years old to use our services.</p>
        </section>

        <section><h2>3. Payments</h2>
          <p>Payments are processed securely through Stripe (web) and Apple App Store (iOS). All prices are displayed in your selected currency. Refunds for eSIM purchases are handled on a case-by-case basis within 14 days if the eSIM has not been activated.</p>
        </section>

        <section><h2>4. Subscriptions (TripPortier+)</h2>
          <p>Premium subscriptions auto-renew unless cancelled. You can cancel anytime through your account settings or Apple ID. Cancellation takes effect at the end of the current billing period.</p>
        </section>

        <section><h2>5. eSIM Terms</h2>
          <ul>
            <li>eSIMs are delivered digitally via QR code</li>
            <li>Your device must support eSIM technology</li>
            <li>Data plans have specific validity periods and data limits</li>
            <li>Unused data does not roll over</li>
            <li>Refunds available within 14 days if not activated</li>
          </ul>
        </section>

        <section><h2>6. Airport Transfers</h2>
          <p>Airport transfers are provided by third-party operators. We act as an intermediary. Free cancellation is available up to 24 hours before the scheduled pickup. The driver will track your flight and adjust for delays at no extra cost.</p>
        </section>

        <section><h2>7. AI Features Disclaimer</h2>
          <p>AI-generated content (trip plans, packing suggestions) is provided as recommendations only. We do not guarantee accuracy or completeness. Always verify important travel information independently.</p>
        </section>

        <section><h2>8. Third-Party Services</h2>
          <p>We integrate with third-party providers including Airalo (eSIM), WelcomeTransfers (airport transfers), 12Go Asia (transport tickets), and FlightAware (flight data). Each has their own terms of service.</p>
        </section>

        <section><h2>9. Limitation of Liability</h2>
          <p>TripPortier is not liable for: third-party service failures, flight changes or cancellations, visa decisions by authorities, network coverage issues with eSIMs, or any indirect damages arising from use of our services.</p>
        </section>

        <section><h2>10. Intellectual Property</h2>
          <p>All content, design, and code on TripPortier is owned by us or our licensors. You may not reproduce, distribute, or create derivative works without written permission.</p>
        </section>

        <section><h2>11. Data Protection</h2>
          <p>Your data is handled according to our <a href="/privacy" className="text-indigo-600 underline">Privacy Policy</a>. We comply with GDPR and Swiss data protection law.</p>
        </section>

        <section><h2>12. Governing Law</h2>
          <p>These terms are governed by Swiss law. Place of jurisdiction is Switzerland.</p>
        </section>

        <section><h2>13. Contact</h2>
          <p>Email: <a href="mailto:hello@tripportier.com" className="text-indigo-600 underline">hello@tripportier.com</a><br/>TripPortier, Switzerland</p>
        </section>
      </div>
    </div>
  )
}
