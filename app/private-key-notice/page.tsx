import Link from "next/link"

const TERMS_URL = "/terms-of-service"
const PRIVACY_URL = "/privacy-policy"

export default function PrivateKeyNoticePage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Private Key Notice
          </h1>
          <p className="text-lg text-gray-600">Save Your Private Key (Required)</p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto prose prose-gray prose-lg font-medium">
          <p className="text-gray-700 leading-relaxed">
            This app uses a private key for registration, login, and getting an access token. Your private
            key is created on your device and never leaves it.
          </p>

          <ul className="list-disc pl-6 text-gray-700 space-y-3">
            <li>
              <strong>Keep it secret.</strong> Anyone with your private key can access your account.
            </li>
            <li>
              <strong>No recovery.</strong> If you lose it, we cannot recover it and you may permanently
              lose access.
            </li>
            <li>
              <strong>Shown once.</strong> This private key may only be displayed during this registration
              step.
            </li>
            <li>
              <strong>Download required to continue:</strong> You must download and safely store your
              private key now.
            </li>
          </ul>

          <div className="not-prose mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <Link href={TERMS_URL} className="text-purple-600 hover:text-purple-800 underline">
              Terms
            </Link>
            <Link href={PRIVACY_URL} className="text-purple-600 hover:text-purple-800 underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}