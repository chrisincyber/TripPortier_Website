import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'TripPortier Privacy Policy - How we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-slate-500 mb-10">Last updated: April 7, 2026</p>

      <div className="space-y-8 text-sm text-slate-700 leading-relaxed [&_h2]:font-display [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mb-3 [&_ul]:space-y-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-5">
        <p>TripPortier (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. This policy explains how we collect, use, store, and safeguard your personal information when you use our website at tripportier.com, our iOS app, and related services (collectively, the &quot;Service&quot;).</p>

        <p><strong>Data Controller:</strong> TripPortier, Switzerland. Contact: <a href="mailto:privacy@tripportier.com" className="text-indigo-600 underline">privacy@tripportier.com</a></p>

        {/* Section 1 */}
        <section>
          <h2>1. Information We Collect</h2>

          <p className="font-medium text-slate-800 mt-3">1.1 Information You Provide</p>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, and authentication credentials when you register via email/password, Google, or Apple Sign In.</li>
            <li><strong>Profile Data:</strong> Display name, avatar, passport nationality (optional, stored locally on device).</li>
            <li><strong>Transaction Data:</strong> Email address for eSIM delivery, purchase history, subscription status. We do not collect or store payment card details.</li>
            <li><strong>Trip Data:</strong> Destinations, dates, flights, bookings, packing lists you create within the Service.</li>
            <li><strong>Communications:</strong> Messages you send to our support team via WhatsApp or email.</li>
          </ul>

          <p className="font-medium text-slate-800 mt-3">1.2 Information Collected Automatically</p>
          <ul>
            <li><strong>Usage Data:</strong> Pages visited, features used, interactions with the Service (only when analytics consent is given).</li>
            <li><strong>Device Information:</strong> Browser type, operating system, device type, screen resolution (only when analytics consent is given).</li>
            <li><strong>IP Address:</strong> Anonymized via Google Analytics (last octet removed). Used for approximate country-level location only.</li>
          </ul>

          <p className="font-medium text-slate-800 mt-3">1.3 Information We Do Not Collect</p>
          <ul>
            <li>Payment card numbers, CVV codes, or banking details (handled entirely by Stripe)</li>
            <li>Precise geolocation without explicit consent</li>
            <li>Biometric data</li>
            <li>Data from children under 16 (see Section 12)</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section>
          <h2>2. Legal Basis for Processing (GDPR)</h2>
          <p>We process personal data under the following legal bases:</p>
          <ul>
            <li><strong>Contract Performance:</strong> Processing necessary to provide the Service, deliver eSIMs, process bookings, and manage your account (Art. 6(1)(b) GDPR).</li>
            <li><strong>Consent:</strong> Analytics cookies, marketing communications, and Trustpilot widget (Art. 6(1)(a) GDPR). You can withdraw consent at any time.</li>
            <li><strong>Legitimate Interest:</strong> Security monitoring, fraud prevention, and service improvement (Art. 6(1)(f) GDPR).</li>
            <li><strong>Legal Obligation:</strong> Retaining transaction records as required by Swiss and EU tax law (Art. 6(1)(c) GDPR).</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section>
          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>Provide, operate, and maintain the Service</li>
            <li>Process transactions and deliver purchased eSIMs via email</li>
            <li>Send transactional notifications (order confirmations, eSIM delivery)</li>
            <li>Generate AI trip suggestions and packing recommendations</li>
            <li>Track flights and provide real-time updates</li>
            <li>Improve and develop features based on aggregated, anonymized usage data</li>
            <li>Communicate updates and offers (only with explicit consent)</li>
            <li>Prevent fraud and ensure security of the Service</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h2>4. Data Storage and Security</h2>
          <p>Your data is stored on Supabase servers in the EU (AWS eu-west-1, Ireland). We implement the following security measures:</p>
          <ul>
            <li>Encryption in transit using TLS 1.2+ for all connections</li>
            <li>Encryption at rest for database storage (AES-256)</li>
            <li>Row-level security (RLS) policies in Supabase ensuring users can only access their own data</li>
            <li>Secure session handling via HTTP-only cookies</li>
            <li>No sensitive data stored in URLs, logs, or client-side storage beyond authentication tokens</li>
            <li>All payment processing handled by PCI DSS Level 1 compliant providers (Stripe)</li>
            <li>Access restricted to authorized personnel on a need-to-know basis</li>
            <li>Regular security reviews and dependency updates</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section>
          <h2>5. Third-Party Data Processors</h2>
          <p>We share data with the following third-party service providers, each acting as a data processor under written agreements:</p>

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 pr-4 font-semibold text-slate-900">Provider</th>
                  <th className="text-left py-2 pr-4 font-semibold text-slate-900">Purpose</th>
                  <th className="text-left py-2 font-semibold text-slate-900">Data Region</th>
                </tr>
              </thead>
              <tbody className="[&_tr]:border-b [&_tr]:border-slate-100">
                <tr><td className="py-2 pr-4 font-medium">Supabase</td><td className="py-2 pr-4">Authentication, database, edge functions</td><td className="py-2">EU (Ireland)</td></tr>
                <tr><td className="py-2 pr-4 font-medium">Stripe</td><td className="py-2 pr-4">Payment processing (PCI DSS Level 1)</td><td className="py-2">US/EU</td></tr>
                <tr><td className="py-2 pr-4 font-medium">Google Analytics</td><td className="py-2 pr-4">Website analytics (consent-gated)</td><td className="py-2">US (SCCs)</td></tr>
                <tr><td className="py-2 pr-4 font-medium">Airalo</td><td className="py-2 pr-4">eSIM provisioning and delivery</td><td className="py-2">Global</td></tr>
                <tr><td className="py-2 pr-4 font-medium">Google Gemini AI</td><td className="py-2 pr-4">AI trip planning and suggestions</td><td className="py-2">US (SCCs)</td></tr>
                <tr><td className="py-2 pr-4 font-medium">FlightAware</td><td className="py-2 pr-4">Flight tracking data</td><td className="py-2">US (SCCs)</td></tr>
                <tr><td className="py-2 pr-4 font-medium">Firebase (Google)</td><td className="py-2 pr-4">Push notifications</td><td className="py-2">US (SCCs)</td></tr>
                <tr><td className="py-2 pr-4 font-medium">Trustpilot</td><td className="py-2 pr-4">Review widget (consent-gated)</td><td className="py-2">EU</td></tr>
                <tr><td className="py-2 pr-4 font-medium">Railway</td><td className="py-2 pr-4">Website hosting</td><td className="py-2">US</td></tr>
              </tbody>
            </table>
          </div>

          <p className="mt-3">We do not sell, rent, or trade your personal information to any third party. We do not share data with data brokers or advertising networks.</p>
        </section>

        {/* Section 6 */}
        <section>
          <h2>6. AI and Data Processing</h2>
          <p>Google Gemini AI powers trip planning features. When you use AI features:</p>
          <ul>
            <li>Trip details (destinations, dates, preferences) are sent to Google&apos;s API for processing</li>
            <li>Google does not use this data for model training under our API agreement</li>
            <li>AI-generated content is clearly marked as suggestions and not guaranteed for accuracy</li>
            <li>No automated decision-making with legal or significant effects is performed</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section id="cookies">
          <h2>7. Cookies and Tracking Technologies</h2>

          <p className="font-medium text-slate-800 mt-3">7.1 Essential Cookies (No Consent Required)</p>
          <ul>
            <li><strong>Supabase Auth Cookies</strong> (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">sb-*-auth-token</code>): Session management. Expires when session ends or after 7 days. HTTP-only, secure, same-site.</li>
            <li><strong>Cookie Consent Preference</strong> (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">cookie_consent</code>): Stores your consent choice. localStorage. Persists until cleared.</li>
          </ul>

          <p className="font-medium text-slate-800 mt-3">7.2 Analytics Cookies (Consent Required)</p>
          <ul>
            <li><strong>Google Analytics</strong> (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">_ga, _ga_*</code>): Anonymous usage analytics with IP anonymization enabled. Expires after 13 months. Only loaded after explicit opt-in consent.</li>
          </ul>

          <p className="font-medium text-slate-800 mt-3">7.3 Third-Party Widgets (Consent Required)</p>
          <ul>
            <li><strong>Trustpilot Widget:</strong> Only loaded when analytics consent is given. May set its own cookies per Trustpilot&apos;s privacy policy.</li>
          </ul>

          <p className="mt-3">We respect the Do Not Track (DNT) browser signal. When DNT is enabled, no analytics cookies are set and no consent banner is shown.</p>

          <p className="mt-2">You can manage your cookie preferences at any time by clicking &quot;Cookie Settings&quot; in the website footer, or by clearing your browser&apos;s localStorage.</p>
        </section>

        {/* Section 8 */}
        <section>
          <h2>8. Your Rights Under GDPR</h2>
          <p>If you are in the European Economic Area (EEA), United Kingdom, or Switzerland, you have the following rights:</p>
          <ol>
            <li><strong>Right of Access (Art. 15):</strong> Request a copy of all personal data we hold about you.</li>
            <li><strong>Right to Rectification (Art. 16):</strong> Correct inaccurate or incomplete personal data.</li>
            <li><strong>Right to Erasure (Art. 17):</strong> Request deletion of your personal data. You can delete your account via Settings &gt; Delete Account, or by emailing us.</li>
            <li><strong>Right to Data Portability (Art. 20):</strong> Receive your data in a structured, machine-readable format (JSON). Request via email.</li>
            <li><strong>Right to Restrict Processing (Art. 18):</strong> Request that we limit how we use your data.</li>
            <li><strong>Right to Object (Art. 21):</strong> Object to processing based on legitimate interests.</li>
            <li><strong>Right to Withdraw Consent (Art. 7(3)):</strong> Withdraw consent at any time for analytics, marketing, or other consent-based processing. Use the cookie settings or email us.</li>
          </ol>
          <p className="mt-3">To exercise any of these rights, contact: <a href="mailto:privacy@tripportier.com" className="text-indigo-600 underline">privacy@tripportier.com</a></p>
          <p>We will respond within 30 days. If you are not satisfied with our response, you have the right to lodge a complaint with your local data protection supervisory authority (e.g., FDPIC in Switzerland, CNIL in France, ICO in the UK).</p>
        </section>

        {/* Section 9 */}
        <section>
          <h2>9. Your Rights Under CCPA/CPRA (California Residents)</h2>
          <p>If you are a California resident, the California Consumer Privacy Act (CCPA) as amended by the California Privacy Rights Act (CPRA) provides you with specific rights:</p>
          <ul>
            <li><strong>Right to Know:</strong> You can request details about the categories and specific pieces of personal information we have collected about you in the past 12 months, the sources, purposes, and categories of third parties with whom we shared it.</li>
            <li><strong>Right to Delete:</strong> You can request deletion of your personal information. Use Settings &gt; Delete Account or email <a href="mailto:privacy@tripportier.com" className="text-indigo-600 underline">privacy@tripportier.com</a>.</li>
            <li><strong>Right to Correct:</strong> You can request correction of inaccurate personal information.</li>
            <li><strong>Right to Opt-Out of Sale/Sharing:</strong> We do not sell or share your personal information for cross-context behavioral advertising. No opt-out is necessary, but we state this explicitly for transparency.</li>
            <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising any of your CCPA rights.</li>
            <li><strong>Right to Limit Use of Sensitive Personal Information:</strong> We do not use sensitive personal information for purposes beyond what is necessary to provide the Service.</li>
          </ul>
          <p className="mt-3"><strong>Categories of personal information collected:</strong> Identifiers (name, email), commercial information (purchase history), internet activity (analytics with consent), geolocation (country-level, anonymized).</p>
          <p><strong>Categories of personal information sold:</strong> None. We do not sell personal information.</p>
          <p>To make a request, email <a href="mailto:privacy@tripportier.com" className="text-indigo-600 underline">privacy@tripportier.com</a> with subject line &quot;CCPA Request&quot;. We will verify your identity before processing.</p>
        </section>

        {/* Section 10 */}
        <section>
          <h2>10. US State Privacy Rights (Other States)</h2>
          <p>Residents of Virginia (VCDPA), Colorado (CPA), Connecticut (CTDPA), Utah (UCPA), and other US states with consumer privacy laws have similar rights to access, delete, correct, and opt-out. We honor these rights regardless of your state of residence. Contact <a href="mailto:privacy@tripportier.com" className="text-indigo-600 underline">privacy@tripportier.com</a> to exercise any data rights.</p>
        </section>

        {/* Section 11 */}
        <section>
          <h2>11. Data Retention</h2>
          <ul>
            <li><strong>Active Accounts:</strong> Data is retained for as long as your account is active.</li>
            <li><strong>Account Deletion:</strong> Personal data removed from production systems within 30 days. Backups purged within 90 days.</li>
            <li><strong>Transaction Records:</strong> Retained for 10 years as required by Swiss commercial law (OR Art. 958f).</li>
            <li><strong>Analytics Data:</strong> Anonymized analytics retained for up to 14 months (Google Analytics default with IP anonymization).</li>
            <li><strong>Support Communications:</strong> Retained for 2 years after last contact, then deleted.</li>
            <li><strong>Consent Records:</strong> Retained for 3 years after consent is given or withdrawn, as proof of compliance.</li>
          </ul>
        </section>

        {/* Section 12 */}
        <section>
          <h2>12. Children&apos;s Privacy</h2>
          <p>The Service is not directed to individuals under 16 years of age. We do not knowingly collect personal information from children under 16. If we become aware that we have collected personal data from a child under 16, we will take steps to delete that information promptly. If you believe a child under 16 has provided us with personal information, please contact <a href="mailto:privacy@tripportier.com" className="text-indigo-600 underline">privacy@tripportier.com</a>.</p>
        </section>

        {/* Section 13 */}
        <section>
          <h2>13. International Data Transfers</h2>
          <p>Your data is primarily processed in the EU (Ireland via Supabase). Where data is transferred outside the EEA (e.g., to US-based processors), we rely on:</p>
          <ul>
            <li>EU Standard Contractual Clauses (SCCs) approved by the European Commission</li>
            <li>The EU-US Data Privacy Framework where applicable</li>
            <li>Adequacy decisions by the European Commission (for Switzerland)</li>
          </ul>
        </section>

        {/* Section 14 */}
        <section>
          <h2>14. Do Not Track</h2>
          <p>We honor the Do Not Track (DNT) browser signal. When your browser sends a DNT signal:</p>
          <ul>
            <li>No analytics cookies are set</li>
            <li>No third-party tracking scripts are loaded</li>
            <li>No cookie consent banner is displayed</li>
          </ul>
        </section>

        {/* Section 15 */}
        <section>
          <h2>15. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. When we make material changes, we will:</p>
          <ul>
            <li>Update the &quot;Last updated&quot; date at the top of this page</li>
            <li>Display a notice on the website for existing users</li>
            <li>Re-prompt for cookie consent if cookie practices change</li>
          </ul>
          <p>Continued use of the Service after changes constitutes acceptance of the updated policy.</p>
        </section>

        {/* Section 16 */}
        <section>
          <h2>16. Contact</h2>
          <p>For any privacy-related questions, data requests, or complaints:</p>
          <p className="mt-2">
            <strong>Email:</strong> <a href="mailto:privacy@tripportier.com" className="text-indigo-600 underline">privacy@tripportier.com</a><br />
            <strong>General:</strong> <a href="mailto:hello@tripportier.com" className="text-indigo-600 underline">hello@tripportier.com</a><br />
            <strong>Location:</strong> TripPortier, Switzerland
          </p>
          <p className="mt-2">We aim to respond to all data protection requests within 30 days.</p>
        </section>
      </div>
    </div>
  )
}
