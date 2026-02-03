import Link from 'next/link'
import { ArrowLeft, Shield, Upload, FileCheck, AlertCircle, Mail, ExternalLink } from 'lucide-react'

export default function DbsApplicationPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/dashboard/staff/profile"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-teal-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">DBS Checks on CareConnect</h1>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4">
              CareConnect does not issue DBS checks directly.
            </p>
            <p className="text-gray-600">
              All care workers using the platform must hold an appropriate Enhanced DBS check for
              regulated activity. DBS checks facilitated through CareConnect are requested by
              participating care providers in accordance with DBS eligibility rules.
            </p>
          </div>
        </div>

        {/* Your Options */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Your Options</h2>

          {/* Option 1 */}
          <div className="mb-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Upload className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  1. Upload an existing DBS certificate
                </h3>
                <p className="text-gray-600 mb-3">
                  If you already hold an Enhanced DBS certificate, you may upload it to your profile.
                </p>
                <p className="text-gray-600">
                  Where applicable, you may also consent to an Update Service status check, allowing
                  participating care providers to verify your DBS status.
                </p>
              </div>
            </div>
            <div className="ml-14">
              <Link
                href="/dashboard/staff/profile"
                className="inline-flex items-center px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
              >
                Upload DBS Certificate
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Link>
            </div>
          </div>

          {/* Option 2 */}
          <div>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  2. Complete a DBS check via CareConnect
                </h3>
                <p className="text-gray-600 mb-3">
                  If you do not currently hold a valid DBS certificate, CareConnect can facilitate a
                  DBS application on behalf of participating care providers who are legally entitled
                  to request checks for regulated care roles.
                </p>
                <p className="text-gray-600">
                  This process is completed through our DBS partners and does not require you to
                  leave the platform.
                </p>
              </div>
            </div>

            <div className="ml-14 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  DBS applications cannot be submitted without an eligible organisation requesting the check.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Important Information</h2>

          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-600">
                CareConnect acts solely as a facilitator of the DBS process.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-600">
                CareConnect does not employ care workers and does not make recruitment decisions.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-600">
                DBS certificates are issued directly to the applicant.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-600">
                Holding a DBS certificate does not guarantee work or engagement via the platform.
              </p>
            </li>
          </ul>
        </div>

        {/* DBS Update Service - Prominent Link */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl shadow-sm p-8 mb-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-4">DBS Update Service</h2>
            <p className="text-teal-100 mb-6 max-w-xl mx-auto">
              The DBS Update Service allows employers to check your DBS certificate online,
              saving you time and money. Registration costs £13 per year and keeps your
              DBS certificate up to date.
            </p>
            <a
              href="https://www.gov.uk/dbs-update-service"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 font-semibold rounded-lg hover:bg-teal-50 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              Register for the DBS Update Service
            </a>
            <p className="text-teal-100 text-sm mt-4">
              Opens GOV.UK in a new tab
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gray-100 rounded-xl p-6 text-center">
          <p className="text-gray-600 mb-2">
            If you have questions about DBS eligibility or the onboarding process, please contact support.
          </p>
          <a
            href="mailto:support@careconnect.uk"
            className="inline-flex items-center text-teal-600 font-medium hover:text-teal-700"
          >
            <Mail className="w-4 h-4 mr-2" />
            support@careconnect.uk
          </a>
        </div>
      </div>
    </div>
  )
}
