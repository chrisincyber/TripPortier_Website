import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'TripPortier Terms of Service - Rules and conditions for using our platform.',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">Terms of Service</h1>
      <p className="text-sm text-slate-500 mb-10">Last updated: April 7, 2026</p>

      <div className="space-y-8 text-sm text-slate-700 leading-relaxed [&_h2]:font-display [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mb-3 [&_ul]:space-y-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-5">
        <p>Welcome to TripPortier. By accessing or using our website (tripportier.com), iOS app, and related services (collectively, the &quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree, please do not use the Service.</p>

        <section>
          <h2>1. Services</h2>
          <p>TripPortier provides travel planning tools including:</p>
          <ul>
            <li>eSIM data plans for international travel</li>
            <li>Airport transfer booking</li>
            <li>Visa requirement checking</li>
            <li>Asia transport ticket booking</li>
            <li>Flight tracking</li>
            <li>AI-powered trip planning (premium feature)</li>
          </ul>
          <p className="mt-2">We act as an intermediary for certain services provided by third parties (Airalo for eSIMs, WelcomeTransfers for airport transfers, 12Go Asia for transport tickets). These third-party services are subject to their own terms.</p>
        </section>

        <section>
          <h2>2. Account Registration</h2>
          <ul>
            <li>You must provide accurate and complete information when creating an account.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You must be at least 16 years old to use the Service.</li>
            <li>You are responsible for all activity under your account.</li>
            <li>You must notify us immediately of any unauthorized use of your account.</li>
          </ul>
        </section>

        <section>
          <h2>3. Payments and Pricing</h2>
          <ul>
            <li>Payments are processed securely through Stripe (web) and Apple App Store (iOS). We never see or store your payment card details.</li>
            <li>All prices are displayed in your selected currency. Currency conversion is approximate and may differ slightly from your bank&apos;s rate.</li>
            <li>Prices are inclusive of applicable taxes unless otherwise stated.</li>
            <li>We reserve the right to change prices at any time. Price changes do not affect already completed purchases.</li>
            <li>Payment disputes should be directed to <a href="mailto:info@tripportier.com" className="text-indigo-600 underline">info@tripportier.com</a> before initiating a chargeback.</li>
          </ul>
        </section>

        <section>
          <h2>4. Subscriptions (TripPortier+)</h2>
          <ul>
            <li>Premium subscriptions auto-renew at the end of each billing period unless cancelled.</li>
            <li>You can cancel anytime through your account settings, Apple ID (for iOS), or by contacting support.</li>
            <li>Cancellation takes effect at the end of the current billing period. No prorated refunds for partial periods.</li>
            <li>We may change subscription pricing with 30 days&apos; notice. Existing subscriptions will be honored until the next renewal.</li>
          </ul>
        </section>

        <section>
          <h2>5. eSIM Terms</h2>
          <ul>
            <li>eSIMs are delivered digitally via QR code sent to the email address you provide at checkout.</li>
            <li>Your device must support eSIM technology. It is your responsibility to verify compatibility before purchase.</li>
            <li>Data plans have specific validity periods and data limits as described at the time of purchase.</li>
            <li>Unused data does not roll over after the validity period expires.</li>
            <li>Refunds are available within 14 days of purchase if the eSIM has not been installed or activated.</li>
            <li>Once an eSIM has been installed and activated, it is non-refundable.</li>
            <li>Network coverage and speeds depend on local carrier infrastructure and are not guaranteed by TripPortier.</li>
          </ul>
        </section>

        <section>
          <h2>6. Airport Transfers</h2>
          <ul>
            <li>Airport transfers are provided by third-party transport operators. We act as a booking intermediary.</li>
            <li>Free cancellation is available up to 24 hours before the scheduled pickup time.</li>
            <li>The driver will track your flight and adjust for delays at no extra cost.</li>
            <li>TripPortier is not liable for delays, cancellations, or service quality issues attributable to the transport operator.</li>
          </ul>
        </section>

        <section>
          <h2>7. AI Features Disclaimer</h2>
          <ul>
            <li>AI-generated content (trip plans, packing suggestions, itineraries) is provided as recommendations only.</li>
            <li>We do not guarantee the accuracy, completeness, or suitability of AI-generated content.</li>
            <li>Always verify important travel information (visa requirements, entry restrictions, health advisories) independently through official sources.</li>
            <li>TripPortier is not liable for any loss or damage resulting from reliance on AI-generated content.</li>
          </ul>
        </section>

        <section>
          <h2>8. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for any unlawful purpose or in violation of any applicable laws</li>
            <li>Attempt to gain unauthorized access to our systems or other users&apos; accounts</li>
            <li>Resell, redistribute, or commercially exploit eSIMs purchased through the Service</li>
            <li>Scrape, crawl, or use automated tools to extract data from the Service without written permission</li>
            <li>Interfere with or disrupt the integrity or performance of the Service</li>
            <li>Upload or transmit any malicious code, viruses, or harmful content</li>
            <li>Impersonate any person or entity or misrepresent your affiliation</li>
          </ul>
        </section>

        <section>
          <h2>9. Third-Party Services</h2>
          <p>We integrate with third-party providers including Airalo (eSIM), WelcomeTransfers (airport transfers), 12Go Asia (transport tickets), FlightAware (flight data), Google Gemini (AI), and Stripe (payments). Each provider has their own terms of service and privacy policy. We are not responsible for the practices or content of third-party services.</p>
        </section>

        <section>
          <h2>10. Intellectual Property</h2>
          <ul>
            <li>All content, design, trademarks, and code on TripPortier is owned by us or our licensors and protected by intellectual property laws.</li>
            <li>You may not reproduce, distribute, modify, or create derivative works from our content without prior written permission.</li>
            <li>You retain ownership of any content you create within the Service (trip plans, packing lists, etc.).</li>
          </ul>
        </section>

        <section>
          <h2>11. Data Protection and Privacy</h2>
          <p>Your data is handled according to our <a href="/privacy" className="text-indigo-600 underline">Privacy Policy</a>. We comply with:</p>
          <ul>
            <li>EU General Data Protection Regulation (GDPR)</li>
            <li>Swiss Federal Act on Data Protection (FADP/nDSG)</li>
            <li>California Consumer Privacy Act (CCPA/CPRA)</li>
            <li>PCI DSS standards for payment security (via Stripe)</li>
          </ul>
          <p className="mt-2"><strong>No Sale of Personal Information:</strong> We do not sell, rent, or trade your personal information to third parties. We do not share personal information for cross-context behavioral advertising.</p>
        </section>

        <section>
          <h2>12. Account Termination</h2>
          <ul>
            <li>You may delete your account at any time via Settings &gt; Delete Account or by emailing <a href="mailto:info@tripportier.com" className="text-indigo-600 underline">info@tripportier.com</a>.</li>
            <li>Upon deletion, your personal data will be removed within 30 days (transaction records may be retained longer per legal requirements).</li>
            <li>We reserve the right to suspend or terminate accounts that violate these Terms, with notice where practicable.</li>
            <li>Termination does not affect any rights or obligations that accrued prior to termination.</li>
          </ul>
        </section>

        <section>
          <h2>13. Limitation of Liability</h2>
          <p>To the maximum extent permitted by applicable law:</p>
          <ul>
            <li>TripPortier is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, express or implied.</li>
            <li>We are not liable for: third-party service failures or quality; flight changes, cancellations, or delays; visa decisions by governmental authorities; network coverage, speed, or connectivity issues with eSIMs; any indirect, incidental, special, consequential, or punitive damages.</li>
            <li>Our total liability for any claim arising from your use of the Service shall not exceed the amount you paid to us in the 12 months preceding the claim.</li>
          </ul>
          <p className="mt-2">Nothing in these Terms excludes or limits liability for: (a) death or personal injury caused by negligence; (b) fraud or fraudulent misrepresentation; or (c) any liability that cannot be excluded by applicable law.</p>
        </section>

        <section>
          <h2>14. Refund Policy</h2>
          <ul>
            <li><strong>eSIMs:</strong> Full refund within 14 days if the eSIM has not been installed or activated. No refund after activation.</li>
            <li><strong>Subscriptions:</strong> No prorated refunds for partial billing periods. Cancel anytime to prevent future charges.</li>
            <li><strong>Airport Transfers:</strong> Full refund for cancellations made 24+ hours before scheduled pickup. Contact support for other cases.</li>
          </ul>
          <p className="mt-2">Refund requests: <a href="mailto:info@tripportier.com" className="text-indigo-600 underline">info@tripportier.com</a></p>
        </section>

        <section>
          <h2>15. Dispute Resolution</h2>
          <ul>
            <li>We encourage you to contact us first to resolve any dispute informally via <a href="mailto:info@tripportier.com" className="text-indigo-600 underline">info@tripportier.com</a>.</li>
            <li>For EU consumers: You may use the European Commission&apos;s Online Dispute Resolution platform at <a href="https://ec.europa.eu/consumers/odr" className="text-indigo-600 underline" target="_blank" rel="noopener noreferrer">ec.europa.eu/consumers/odr</a>.</li>
            <li>If informal resolution fails, disputes shall be resolved through the competent courts of Switzerland (see Section 17).</li>
          </ul>
        </section>

        <section>
          <h2>16. Force Majeure</h2>
          <p>We shall not be liable for any failure or delay in performing our obligations where such failure or delay results from circumstances beyond our reasonable control, including but not limited to: natural disasters, pandemics, war, terrorism, government actions, network or power failures, or third-party service outages.</p>
        </section>

        <section>
          <h2>17. Governing Law and Jurisdiction</h2>
          <p>These Terms are governed by and construed in accordance with the laws of Switzerland, without regard to its conflict of law principles. The exclusive place of jurisdiction is Switzerland.</p>
          <p className="mt-2">For EU consumers: Nothing in these Terms affects your rights under mandatory consumer protection laws of your country of residence.</p>
        </section>

        <section>
          <h2>18. Changes to These Terms</h2>
          <p>We may modify these Terms at any time. When we make material changes:</p>
          <ul>
            <li>We will update the &quot;Last updated&quot; date at the top of this page.</li>
            <li>We will notify registered users via email or in-app notification for significant changes.</li>
            <li>Continued use of the Service after changes constitutes acceptance of the updated Terms.</li>
          </ul>
        </section>

        <section>
          <h2>19. Severability</h2>
          <p>If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.</p>
        </section>

        <section>
          <h2>20. Contact</h2>
          <p>
            <strong>Email:</strong> <a href="mailto:info@tripportier.com" className="text-indigo-600 underline">info@tripportier.com</a><br />
            <strong>Privacy:</strong> <a href="mailto:info@tripportier.com" className="text-indigo-600 underline">info@tripportier.com</a><br />
            <strong>Location:</strong> TripPortier, Switzerland
          </p>
        </section>
      </div>
    </div>
  )
}
