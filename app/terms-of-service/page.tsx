import LandingHeader from "@/components/landing/landing-header"
import Footer from "@/components/footer"

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-white">
      <LandingHeader />
      
      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Terms of Service
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
            Welcome to Katron AI. These Terms of Service ("Terms") govern your access to and use of the websites, applications, products, and services (collectively, the "Services") provided by KatronAI, Inc. (doing business as Katron AI) ("Katron AI," "we," "us," or "our").
          </p>

          <div className="bg-purple-50 border-l-4 border-purple-600 p-4 my-8">
            <p className="text-gray-800 font-medium">
              BY ACCESSING OR USING OUR SERVICES, YOU AGREE TO BE BOUND BY THESE TERMS. IF YOU DO NOT AGREE TO THESE TERMS, DO NOT ACCESS OR USE THE SERVICES.
            </p>
          </div>

          {/* Section 1 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">1. Acceptance of Terms</h2>
          
          <p className="text-gray-700 leading-relaxed">
            By creating an account, accessing, or using any part of the Services, you acknowledge that you have read, understood, and agree to be bound by these Terms, our Privacy Policy, and any additional terms and policies referenced herein.
          </p>
          
          <p className="text-gray-700 leading-relaxed mt-4">
            We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on our website and updating the "Last Updated" date. Your continued use of the Services after any changes indicates your acceptance of the modified Terms.
          </p>

          {/* Section 2 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">2. Eligibility</h2>
          
          <p className="text-gray-700 leading-relaxed">
            The Services are intended for individuals who are at least 18 years of age. By using the Services, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into these Terms. If you are using the Services on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms.
          </p>

          {/* Section 3 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">3. Description of Services</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">Katron AI provides a digital marketplace and rewards platform that includes:</p>
          
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Gift Card Marketplace:</strong> A platform for purchasing digital gift cards from various brands and retailers.</li>
            <li><strong>KTN-R Rewards Program:</strong> A utility rewards token program where eligible users can earn KTN-R tokens on qualifying purchases made through the Katron AI mobile application.</li>
            <li><strong>User App:</strong> A mobile application for consumers to browse, purchase, and manage gift cards, and participate in the rewards program.</li>
            <li><strong>Merchant App:</strong> A mobile application for merchants to manage their presence on the Katron AI platform, including product listings, promotions, and customer engagement.</li>
            <li><strong>Website:</strong> The Katron AI website (www.katronai.com) for browsing and purchasing gift cards.</li>
          </ul>

          {/* Section 4 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">4. Account Registration and Security</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4.1 Account Creation</h3>
          <p className="text-gray-700 leading-relaxed">
            To access certain features of the Services, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4.2 Account Security</h3>
          <p className="text-gray-700 leading-relaxed">
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4.3 Account Termination</h3>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to suspend or terminate your account at any time for any reason, including but not limited to violation of these Terms, fraudulent activity, or inactivity.
          </p>

          {/* Section 5 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">5. Gift Card Purchases</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5.1 Purchase Terms</h3>
          <p className="text-gray-700 leading-relaxed">
            When you purchase a gift card through our Services, you agree to pay the stated price plus any applicable taxes and fees. All purchases are final and non-refundable unless otherwise required by law or as specified in our Refund Policy.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5.2 Digital Delivery</h3>
          <p className="text-gray-700 leading-relaxed">
            Gift cards are delivered digitally to your account or email address. Delivery times may vary. We are not responsible for delays caused by third-party providers or technical issues beyond our control.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5.3 Third-Party Terms</h3>
          <p className="text-gray-700 leading-relaxed">
            Gift cards are subject to the terms and conditions of the issuing brand or retailer. We are not responsible for the terms, restrictions, or expiration dates imposed by third-party gift card issuers.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5.4 Payment Processing</h3>
          <p className="text-gray-700 leading-relaxed">
            Payment processing is handled by third-party payment providers. Katron AI does not store or have access to your full payment card information. By making a purchase, you agree to the terms and privacy policies of our payment processors.
          </p>

          {/* Section 6 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">6. KTN-R Rewards Program</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6.1 Earning KTN-R</h3>
          <p className="text-gray-700 leading-relaxed">
            KTN-R tokens may be earned on eligible purchases made through the Katron AI User App, subject to program rules and verification. Gift card purchases made through the Website do not earn KTN-R rewards.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6.2 Nature of KTN-R</h3>
          <p className="text-gray-700 leading-relaxed">
            KTN-R is a utility rewards token recorded on a private blockchain within the Katron AI network. KTN-R is not cash, is not redeemable for cash, and has no monetary value outside of the Katron AI platform. KTN-R is intended solely for use within the KATRON PAY network with participating merchants.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6.3 Redemption</h3>
          <p className="text-gray-700 leading-relaxed">
            KTN-R may be redeemed for discounts, offers, and rewards at participating merchants within the Katron AI network. Redemption options, earning rates, and availability may vary and can change at any time without notice.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6.4 Non-Custodial Wallet</h3>
          <p className="text-gray-700 leading-relaxed">
            Where wallet functionality is enabled, private keys are generated and controlled by users. We do not have access to private keys and cannot recover them. If you lose your private key, you may permanently lose access to associated tokens.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6.5 Program Modifications</h3>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to modify, suspend, or terminate the KTN-R rewards program at any time without prior notice. We may also adjust earning rates, redemption values, and program rules at our discretion.
          </p>

          {/* Section 7 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">7. User Conduct</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">You agree not to:</p>
          
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Use the Services for any unlawful purpose or in violation of any applicable laws or regulations.</li>
            <li>Engage in fraudulent activity, including but not limited to using stolen payment methods, creating fake accounts, or manipulating the rewards program.</li>
            <li>Attempt to gain unauthorized access to our systems, other users' accounts, or any data not intended for you.</li>
            <li>Interfere with or disrupt the Services, servers, or networks connected to the Services.</li>
            <li>Use automated systems, bots, or scripts to access or interact with the Services without our express written permission.</li>
            <li>Resell, redistribute, or commercially exploit gift cards purchased through our platform in violation of issuer terms.</li>
            <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity.</li>
            <li>Upload or transmit viruses, malware, or any other malicious code.</li>
            <li>Harass, abuse, or harm other users or our staff.</li>
          </ul>

          {/* Section 8 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">8. Intellectual Property</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8.1 Our Intellectual Property</h3>
          <p className="text-gray-700 leading-relaxed">
            The Services, including all content, features, functionality, software, designs, text, graphics, logos, and trademarks, are owned by Katron AI or our licensors and are protected by intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our Services without our express written permission.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8.2 User Content</h3>
          <p className="text-gray-700 leading-relaxed">
            If you submit any content through the Services (such as reviews, comments, or feedback), you grant us a non-exclusive, royalty-free, worldwide license to use, display, reproduce, and distribute such content in connection with the Services.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8.3 Third-Party Trademarks</h3>
          <p className="text-gray-700 leading-relaxed">
            All brand names, logos, and trademarks displayed on the Services are the property of their respective owners. Their display on our platform does not imply endorsement or affiliation with Katron AI.
          </p>

          {/* Section 9 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">9. Privacy</h2>
          
          <p className="text-gray-700 leading-relaxed">
            Your privacy is important to us. Our collection, use, and disclosure of your information are governed by our <a href="/privacy-policy" className="text-purple-600 hover:text-purple-800 underline">Privacy Policy</a>, which is incorporated into these Terms by reference. By using the Services, you consent to our collection and use of information as described in the Privacy Policy.
          </p>

          {/* Section 10 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">10. Third-Party Services and Links</h2>
          
          <p className="text-gray-700 leading-relaxed">
            The Services may contain links to third-party websites, applications, or services that are not owned or controlled by Katron AI. We are not responsible for the content, privacy policies, or practices of any third-party sites or services. You access third-party content at your own risk.
          </p>

          {/* Section 11 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">11. Disclaimers</h2>
          
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 my-6">
            <p className="text-gray-700 leading-relaxed">
              THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
            </p>
          </div>

          <p className="text-gray-700 leading-relaxed">
            Katron AI does not guarantee the availability, accuracy, or quality of any gift cards, third-party products, or services offered through the platform. We are not responsible for any loss or damage resulting from your reliance on information or content obtained through the Services.
          </p>

          {/* Section 12 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">12. Limitation of Liability</h2>
          
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 my-6">
            <p className="text-gray-700 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, KATRON AI, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (A) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICES; (B) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICES; (C) ANY CONTENT OBTAINED FROM THE SERVICES; OR (D) UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT.
            </p>
          </div>

          <p className="text-gray-700 leading-relaxed">
            IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATED TO THE SERVICES EXCEED THE AMOUNT YOU PAID TO US, IF ANY, IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
          </p>

          {/* Section 13 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">13. Indemnification</h2>
          
          <p className="text-gray-700 leading-relaxed">
            You agree to indemnify, defend, and hold harmless Katron AI, its officers, directors, employees, agents, and affiliates from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from or related to: (a) your use of the Services; (b) your violation of these Terms; (c) your violation of any rights of another party; or (d) your conduct in connection with the Services.
          </p>

          {/* Section 14 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">14. Dispute Resolution</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">14.1 Governing Law</h3>
          <p className="text-gray-700 leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of the State of Texas, without regard to its conflict of laws principles.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">14.2 Arbitration Agreement</h3>
          <p className="text-gray-700 leading-relaxed">
            You and Katron AI agree that any dispute, claim, or controversy arising out of or relating to these Terms or the Services shall be resolved through binding arbitration, except that either party may seek injunctive or other equitable relief in a court of competent jurisdiction to prevent the actual or threatened infringement of intellectual property rights.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">14.3 Class Action Waiver</h3>
          <p className="text-gray-700 leading-relaxed">
            YOU AND KATRON AI AGREE THAT EACH PARTY MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">14.4 Informal Resolution</h3>
          <p className="text-gray-700 leading-relaxed">
            Before initiating arbitration, you agree to first contact us at contact@katronai.com to attempt to resolve the dispute informally. If we are unable to resolve the dispute within 30 days, either party may proceed with arbitration.
          </p>

          {/* Section 15 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">15. General Provisions</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">15.1 Entire Agreement</h3>
          <p className="text-gray-700 leading-relaxed">
            These Terms, together with the Privacy Policy and any other policies referenced herein, constitute the entire agreement between you and Katron AI regarding the Services and supersede all prior agreements and understandings.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">15.2 Severability</h3>
          <p className="text-gray-700 leading-relaxed">
            If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">15.3 Waiver</h3>
          <p className="text-gray-700 leading-relaxed">
            Our failure to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">15.4 Assignment</h3>
          <p className="text-gray-700 leading-relaxed">
            You may not assign or transfer these Terms or your rights hereunder without our prior written consent. We may assign these Terms without restriction.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">15.5 Force Majeure</h3>
          <p className="text-gray-700 leading-relaxed">
            We shall not be liable for any failure or delay in performing our obligations under these Terms due to causes beyond our reasonable control, including but not limited to natural disasters, war, terrorism, labor disputes, government actions, or internet or telecommunications failures.
          </p>

          {/* Section 16 */}
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">16. Contact Us</h2>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            If you have any questions about these Terms, please contact us:
          </p>

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
