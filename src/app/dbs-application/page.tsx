import Link from 'next/link'
import { Construction, ArrowLeft, ExternalLink, Mail } from 'lucide-react'

export default function DbsApplicationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Construction className="w-10 h-10 text-amber-600" />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            DBS Application Coming Soon
          </h1>

          <p className="text-gray-600 mb-6">
            We're working on integrating an online DBS application service directly into CareConnect.
            This feature will allow you to apply for an Enhanced DBS check without leaving the platform.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h2 className="font-semibold text-gray-900 mb-2">In the meantime:</h2>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">1.</span>
                <span>Visit the official DBS website to apply for an Enhanced DBS check</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">2.</span>
                <span>Once received, upload your DBS certificate to your profile</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">3.</span>
                <span>Consider registering for the DBS Update Service for future convenience</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <a
              href="https://www.gov.uk/request-copy-criminal-record"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
            >
              Visit GOV.UK DBS Service
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>

            <a
              href="https://www.gov.uk/dbs-update-service"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full px-6 py-3 border-2 border-teal-600 text-teal-600 font-semibold rounded-lg hover:bg-teal-50 transition-colors"
            >
              Learn About Update Service
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>

            <Link
              href="/dashboard/staff/profile"
              className="inline-flex items-center justify-center w-full px-6 py-3 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Need assistance? Contact us at{' '}
              <a href="mailto:support@careconnect.uk" className="text-teal-600 hover:text-teal-700">
                support@careconnect.uk
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
