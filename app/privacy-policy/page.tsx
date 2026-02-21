import Footer from "@/components/footer"

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      
      {/* Hero Section */}}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">
            Last Updated: February 5, 2026
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto prose prose-gray prose-lg">
          
          {/* Introduction */}
          <p className="text-gray-700 leading-relaxed">
            This Privacy Policy (this "Privacy Policy") describes how KatronAI, Inc. (doing business as Katron AI) ("Katron AI," "we," "us," or "our") collects, uses, discloses, and protects information when you access or use:
          </p>
          
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>our websites, including www.katronai.com (collectively, the "Website")</li>
            <li>the Katron AI User App (the "User App")</li>
            <li>the Katron AI Merchant App (the "Merchant App")</li>
            <li>any related online or offline services, features, or communications that link to or reference this Privacy Policy (collectively, the "Services")</li>
          </ul>

          <p className="text-gray-700 leading-relaxed">
            This Privacy Policy applies to individuals who access or use the Services, including consumers ("Users"), merchants ("Merchants"), and Merchant employees or contractors who access the Merchant App ("Authorized Users").
          </p>

          <div className="bg-purple-50 border-l-4 border-purple-600 p-4 my-8">
            <p className="text-gray-800 font-medium">
              BY VISITING, ACCESSING, REGISTERING FOR, OR USING THE SERVICES, YOU ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTOOD THIS PRIVACY POLICY.
            </p>
          </div>

          {/* Section 1 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">1. Important Operational Summary (Key Points)</h2>
          
          <ul className="list-disc pl-6 text-gray-700 space-y-3">
            <li><strong>Payments.</strong> Katron AI does not process payment card transactions for point-of-sale purchases. Payment processing is handled by third parties.</li>
            <li><strong>Funds.</strong> Katron AI does not hold customer funds for point-of-sale purchases.</li>
            <li><strong>Rewards data matching.</strong> To verify rewards eligibility and deliver rewards, we may collect limited transaction verification elements such as an authorization code, transaction amount, and limited card verification data such as the first 6 digits and last 4 digits of the card.</li>
            <li><strong>KTN-R token.</strong> Rewards may be issued as KTN-R, a utility rewards token recorded on a private blockchain within the Katron AI network.</li>
            <li><strong>Non-custodial keys.</strong> Where wallet functionality is enabled, private keys are generated and controlled by the user. We do not have access to, and cannot recover, private keys.</li>
            <li><strong>Location.</strong> The apps may collect precise GPS location if you permit it.</li>
            <li><strong>Website analytics.</strong> We use Google Analytics primarily on the Website.</li>
            <li><strong>Advertising (current vs future).</strong> As of the "Last Updated" date, we do not operate retargeting/remarketing or cross-device matching for advertising purposes. We may implement marketing and advertising features in the future.</li>
            <li><strong>Website gift cards and rewards.</strong> Gift card purchases made through the Website do not earn KTN-R rewards.</li>
          </ul>

          {/* Section 2 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">2. Eligibility and Children's Privacy</h2>
          
          <p className="text-gray-700 leading-relaxed">
            The Services are intended for individuals 18 years of age and older. We do not knowingly collect Personal Information from individuals under 18. If you believe a minor has provided Personal Information to us, contact us at contact@katronai.com.
          </p>

          {/* Section 3 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">3. Definitions</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">For purposes of this Privacy Policy:</p>
          
          <ul className="list-disc pl-6 text-gray-700 space-y-3">
            <li><strong>"Personal Information"</strong> means information that identifies, relates to, describes, is reasonably capable of being associated with, or could reasonably be linked (directly or indirectly) to an individual.</li>
            <li><strong>"Non-Personal Information"</strong> means information that does not reasonably identify you, such as aggregated or de-identified information.</li>
            <li><strong>"Precise Geolocation"</strong> means location information that can identify your precise location (for example, GPS).</li>
            <li><strong>"Merchant Content"</strong> means content Merchants upload or provide through the Merchant App (for example, logos, product photos, product descriptions, menus/catalogs, promotions, discounts).</li>
          </ul>

          {/* Section 4 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">4. Information We Collect</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">We collect information in three primary ways:</p>
          
          <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-6">
            <li>Information you provide.</li>
            <li>Information collected automatically.</li>
            <li>Information collected from third parties.</li>
          </ol>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4.1 Information you provide (Users)</h3>
          <p className="text-gray-700 leading-relaxed mb-4">Depending on your use of the Services, you may provide:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Account information:</strong> name, email address, phone number.</li>
            <li><strong>Receipt/rewards claim information:</strong> receipt images or scans (if enabled), authorization code entries, and other information you submit to claim rewards.</li>
            <li><strong>Communications:</strong> information you provide when you contact us (for example, support emails and attachments).</li>
            <li><strong>User content:</strong> reviews, comments, or other content you submit (if enabled).</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4.2 Information you provide (Merchants and Authorized Users)</h3>
          <p className="text-gray-700 leading-relaxed mb-4">Depending on your use of the Merchant App, you may provide:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Merchant onboarding and account information:</strong> business name, contact name, email, phone number, store address, and other business details you submit.</li>
            <li><strong>Merchant Content:</strong> logos, product listings, photos, descriptions, menus/catalogs, discount terms, and promotions.</li>
            <li><strong>Communications:</strong> support and operational messages.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4.3 Rewards verification and transaction matching information</h3>
          <p className="text-gray-700 leading-relaxed mb-4">To verify rewards and issue KTN-R, we may collect and process limited transaction and verification elements such as:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>transaction authorization code</li>
            <li>transaction amount</li>
            <li>first 6 digits and last 4 digits of a payment card</li>
            <li>timestamps and other matching metadata</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">We do not request your full card number for rewards verification.</p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4.4 Location information (Apps)</h3>
          <p className="text-gray-700 leading-relaxed mb-4">If you grant location permission, we may collect Precise Geolocation (GPS) through the apps to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>show nearby Merchants and offers</li>
            <li>provide navigation or map-based features</li>
            <li>support security and fraud-prevention controls</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">You can control location permissions through your device settings. Disabling location may limit functionality.</p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4.5 Device and usage data (Apps and Website)</h3>
          <p className="text-gray-700 leading-relaxed mb-4">We may automatically collect:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Device data:</strong> device type, operating system, app version, language settings, and identifiers necessary for app functionality.</li>
            <li><strong>Log data:</strong> IP address, timestamps, error logs, crash reports, and diagnostic signals.</li>
            <li><strong>Usage data:</strong> features used, pages/screens viewed, clicks/taps, and interaction patterns.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4.6 Cookies and similar technologies (Website)</h3>
          <p className="text-gray-700 leading-relaxed">
            We may use cookies, pixels, tags, and similar technologies to support Website functionality, security, analytics, and (in the future) marketing and advertising. For more information, please see our Cookie Notice.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4.7 Google Analytics (Website)</h3>
          <p className="text-gray-700 leading-relaxed">
            We use Google Analytics primarily on the Website to help measure Website usage and improve performance. Depending on configuration, Google Analytics may collect information such as pages visited, device/browser information, approximate location derived from IP address, and interaction events.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4.8 Social login (Website)</h3>
          <p className="text-gray-700 leading-relaxed">
            The Website may offer sign-in using third-party identity providers (for example, Google or Facebook login). Those providers may use cookies or similar technologies to authenticate users and help prevent fraud. We may receive certain account details depending on the permissions you grant.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4.9 AI-based chat feature (Website)</h3>
          <p className="text-gray-700 leading-relaxed">
            If the Website offers an AI-based chat feature, the chat feature may use cookies or similar technologies to maintain session continuity, provide support, and troubleshoot issues.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4.10 Third-party checkout and payments (Website and/or Apps)</h3>
          <p className="text-gray-700 leading-relaxed">
            Some purchases (including gift card purchases) may be processed through third-party checkout and payment providers. These providers may collect information directly as part of the transaction and may use cookies or similar technologies for security and fraud prevention.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4.11 Information from third parties</h3>
          <p className="text-gray-700 leading-relaxed mb-4">We may receive information from third parties such as:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>transaction status and delivery/non-delivery signals for gift cards</li>
            <li>fraud and risk signals</li>
            <li>service provider signals necessary to operate features you use</li>
          </ul>

          {/* Section 5 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">5. How We Use Information</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">We use information for purposes that include:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Providing and operating the Services,</strong> including account creation, authentication, and feature delivery.</li>
            <li><strong>Rewards verification and issuance,</strong> including transaction matching and anti-fraud checks.</li>
            <li><strong>Providing Merchant marketplace features,</strong> including displaying Merchant Content and offers.</li>
            <li><strong>Providing location-based features,</strong> if enabled.</li>
            <li><strong>Gift card operations,</strong> including order processing support, delivery support, and non-delivery investigations.</li>
            <li><strong>Security and fraud prevention,</strong> including enforcing our terms and policies and preventing misuse.</li>
            <li><strong>Analytics and product improvement,</strong> including Website analytics.</li>
            <li><strong>Communications,</strong> including service-related notifications, administrative messages, and support.</li>
            <li><strong>Legal and compliance,</strong> including responding to lawful requests and protecting rights and safety.</li>
          </ul>

          {/* Section 6 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">6. How We Disclose Information</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">We may disclose information in the following ways:</p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6.1 Service providers</h3>
          <p className="text-gray-700 leading-relaxed">
            We may share information with service providers who perform services on our behalf, such as hosting, infrastructure, analytics, support tools, security and fraud prevention tools, communications providers, and technical consultants.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6.2 Gift card and checkout providers</h3>
          <p className="text-gray-700 leading-relaxed">
            We may disclose information as needed to facilitate gift card transactions, fraud prevention, and delivery/non-delivery investigations.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6.3 Merchants and offer/redemption workflows</h3>
          <p className="text-gray-700 leading-relaxed">
            We may disclose certain information to Merchants where necessary to operate merchant offers, discounts, redemptions, and related support and fraud prevention.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6.4 Legal, safety, and enforcement</h3>
          <p className="text-gray-700 leading-relaxed">
            We may disclose information if we believe disclosure is necessary to comply with law, respond to legal process, protect rights and safety, investigate fraud or security issues, or enforce our agreements.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6.5 Business transfers</h3>
          <p className="text-gray-700 leading-relaxed">
            If we are involved in a merger, acquisition, financing, reorganization, or sale of assets, information may be disclosed in connection with that transaction subject to appropriate safeguards.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6.6 Aggregated or de-identified information</h3>
          <p className="text-gray-700 leading-relaxed">
            We may disclose aggregated or de-identified information that does not reasonably identify you.
          </p>

          {/* Section 7 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">7. Advertising, Retargeting, and Cross-Device Matching (Current and Future)</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7.1 Current status</h3>
          <p className="text-gray-700 leading-relaxed">
            As of the "Last Updated" date, we primarily use cookies and similar technologies for essential website functions, security, fraud prevention, and analytics/performance measurement. We do not currently operate targeted advertising campaigns based on your activity on our Website or apps.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7.2 Future advertising and remarketing</h3>
          <p className="text-gray-700 leading-relaxed">
            We may implement marketing and advertising features in the future, including remarketing/retargeting and similar practices (for example, showing ads to people who previously visited our Website or used our Services). If we do, we may use cookies, pixels, SDKs, or similar technologies and work with advertising platforms and service providers.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7.3 Cross-device matching</h3>
          <p className="text-gray-700 leading-relaxed">
            We do not currently engage in cross-device matching for advertising purposes. If we implement cross-device matching in the future (for example, to support marketing measurement or to understand usage across devices), we will update this Privacy Policy and describe the types of information used and the choices available.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7.4 Your choices</h3>
          <p className="text-gray-700 leading-relaxed">
            If we implement these advertising features, we may provide additional opt-out options or settings, and you may also be able to manage certain preferences through browser/device settings and third-party tools.
          </p>

          {/* Section 8 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">8. KTN-R Disclosures and Website vs In-App Reward Eligibility</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8.1 No KTN-R rewards for Website gift card purchases</h3>
          <p className="text-gray-700 leading-relaxed">
            Gift card purchases made through the Website do not earn KTN-R rewards.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8.2 In-app eligibility only (if offered)</h3>
          <p className="text-gray-700 leading-relaxed">
            If Katron AI offers KTN-R rewards for gift card purchases, those rewards are available only for eligible purchases completed through designated in-app purchase flows (for example, within the User App) and are subject to the applicable program terms.
          </p>

          {/* Section 9 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">9. Blockchain and Non-Custodial Wallet Considerations</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9.1 Private blockchain records</h3>
          <p className="text-gray-700 leading-relaxed">
            Certain KTN-R and rewards-related records may be recorded on our private blockchain within the Katron AI network. Depending on system design, some records may be difficult or impossible to modify once recorded.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9.2 Private keys</h3>
          <p className="text-gray-700 leading-relaxed">
            Where wallet functionality is enabled, private keys are generated and controlled by users. We do not have access to private keys and cannot recover them. If you lose your private key, you may permanently lose access to associated tokens.
          </p>

          {/* Section 10 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">10. Your Choices and Controls</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10.1 Location permissions</h3>
          <p className="text-gray-700 leading-relaxed">
            You can enable or disable GPS permissions in your device settings.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10.2 Cookies (Website)</h3>
          <p className="text-gray-700 leading-relaxed">
            You can manage cookies through your browser settings and, if enabled, through our cookie banner or preference tool.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10.3 Account closure and deletion requests (email only)</h3>
          <p className="text-gray-700 leading-relaxed">
            We do not currently provide in-app deletion. To request account closure or deletion, email contact@katronai.com. We may require verification of account ownership. We may retain certain information for security, fraud prevention, compliance, dispute resolution, and legitimate business purposes.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10.4 Marketing communications</h3>
          <p className="text-gray-700 leading-relaxed">
            Where applicable, you can opt out of certain marketing emails using the unsubscribe mechanism or by contacting us.
          </p>

          {/* Section 11 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">11. Data Retention</h2>
          <p className="text-gray-700 leading-relaxed">
            We retain information for as long as reasonably necessary to provide and secure the Services, prevent fraud, comply with obligations, resolve disputes, and enforce our agreements. Retention periods vary depending on data type and context.
          </p>

          {/* Section 12 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">12. Security</h2>
          <p className="text-gray-700 leading-relaxed">
            We implement reasonable administrative, technical, and organizational safeguards designed to protect information. No system can be guaranteed to be 100% secure.
          </p>

          {/* Section 13 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">13. International Access</h2>
          <p className="text-gray-700 leading-relaxed">
            Rewards functionality is intended for use in the United States (including Texas, Georgia, Virginia, and New York City and surrounding areas, subject to change). The Website (including gift card purchasing features) may be accessed from outside the United States.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            If you access the Services from outside the U.S., your information may be processed and stored in the U.S. or other locations where we or our service providers operate.
          </p>

          {/* Section 14 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">14. Changes to this Privacy Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time. Changes are effective upon posting unless stated otherwise. If we make material changes (including introducing targeted advertising or remarketing), we may provide additional notice through the Services, by email, and/or by updating the "Last Updated" date.
          </p>

          {/* Section 15 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">15. Contact Us</h2>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <p className="text-gray-900 font-semibold mb-2">KatronAI, Inc. (d/b/a Katron AI)</p>
            <p className="text-gray-700">5727 Euclid Loop</p>
            <p className="text-gray-700">Rosenberg, TX 77469</p>
            <p className="text-gray-700 mt-4">
              <strong>Email:</strong> contact@katronai.com
            </p>
            <p className="text-gray-700">
              <strong>Phone:</strong> +1 404-44-47-260
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  )
}
