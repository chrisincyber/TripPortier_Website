import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'TripPortier Privacy Policy - How we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-slate-500 mb-10">Last updated: January 30, 2025</p>

      <div className="space-y-8 text-sm text-slate-700 leading-relaxed [&_h2]:font-display [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mb-3 [&_ul]:space-y-1.5 [&_ul]:list-disc [&_ul]:pl-5">
        <p>TripPortier (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.</p>

        <section><h2>1. Information We Collect</h2>
          <p><strong>Account Information:</strong> Name, email, authentication credentials (email/password, Google, Apple Sign In).</p>
          <p><strong>Trip Data:</strong> Destinations, dates, flights, bookings, packing lists.</p>
          <p><strong>Usage Data:</strong> App interactions, feature usage, device information.</p>
          <p><strong>Payment:</strong> Handled entirely by Stripe and Apple. We never store card numbers.</p>
        </section>

        <section><h2>2. How We Use Your Information</h2>
          <ul>
            <li>Provide and personalize services</li>
            <li>Process transactions and notifications</li>
            <li>Generate AI trip suggestions and packing recommendations</li>
            <li>Track flights and provide real-time updates</li>
            <li>Improve our app and develop features</li>
            <li>Communicate updates and offers (with consent)</li>
          </ul>
        </section>

        <section><h2>3. Data Storage and Security</h2>
          <p>Data stored on Supabase servers in the EU (Ireland). We use encryption in transit (TLS) and at rest. Access restricted to authorized personnel.</p>
        </section>

        <section><h2>4. AI and Data Processing</h2>
          <p>Google Gemini AI powers trip planning. Trip details sent to Google API for processing. Google does not use this data for training. AI content is marked as suggestions.</p>
        </section>

        <section><h2>5. Third-Party Services</h2>
          <ul>
            <li><strong>Supabase</strong> - Authentication and data storage (EU)</li>
            <li><strong>Google Analytics</strong> - Analytics (consent-gated)</li>
            <li><strong>Stripe</strong> - Payments (PCI DSS compliant)</li>
            <li><strong>Airalo</strong> - eSIM provisioning</li>
            <li><strong>FlightAware</strong> - Flight tracking</li>
            <li><strong>Google Gemini</strong> - AI trip planning</li>
          </ul>
        </section>

        <section><h2>6. Cookies</h2>
          <p>Only necessary cookies (auth sessions) and analytics (GA, consent-gated). We respect DNT signals. Manage preferences anytime.</p>
        </section>

        <section><h2>7. Your Rights (GDPR)</h2>
          <ul>
            <li>Access, rectify, delete your data</li>
            <li>Data portability</li>
            <li>Restrict processing</li>
            <li>Withdraw consent</li>
          </ul>
          <p>Contact: <a href="mailto:privacy@tripportier.com" className="text-indigo-600 underline">privacy@tripportier.com</a> (30-day response)</p>
        </section>

        <section><h2>8. Data Retention</h2>
          <p>Active accounts: data retained. Deletion: removed within 30 days. Backups purged within 90 days. Anonymized analytics: up to 13 months.</p>
        </section>

        <section><h2>9. International Transfers</h2>
          <p>Data processed in the EU. Transfers outside EU use Standard Contractual Clauses.</p>
        </section>

        <section><h2>10. California Residents (CCPA)</h2>
          <p>Right to know, right to delete, right to opt-out. We do not sell personal information.</p>
        </section>

        <section><h2>11. Contact</h2>
          <p>Email: <a href="mailto:privacy@tripportier.com" className="text-indigo-600 underline">privacy@tripportier.com</a><br/>TripPortier, Switzerland</p>
        </section>
      </div>
    </div>
  )
}
