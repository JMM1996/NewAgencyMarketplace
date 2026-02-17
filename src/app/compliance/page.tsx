import Link from 'next/link'
import { Shield, FileCheck, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Compliance | Clovia',
  description: 'How Clovia ensures all care professionals meet regulatory compliance requirements.',
}

export default function CompliancePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Compliance & Safety
          </h1>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto">
            Every carer on Clovia is fully vetted before they can accept shifts. Here&apos;s how we ensure compliance.
          </p>
        </div>
      </section>

      {/* Verification Requirements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">What We Verify</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Shield,
                title: 'Enhanced DBS Check',
                requirements: [
                  'Valid Enhanced DBS certificate for regulated activity',
                  'Certificate must be less than 3 years old (unless on Update Service)',
                  'Update Service status checked where registered',
                  'Adult workforce barred list check included',
                ],
              },
              {
                icon: FileCheck,
                title: 'Right to Work',
                requirements: [
                  'UK or Irish passport, or',
                  'Biometric Residence Permit, or',
                  'Valid visa with work permission',
                  'Share codes verified with Home Office',
                ],
              },
              {
                icon: Shield,
                title: 'Public Liability Insurance',
                requirements: [
                  'Valid public liability insurance required',
                  'Minimum cover as required for care work',
                  'Policy documents verified',
                  'Expiry dates tracked and renewal reminders sent',
                ],
              },
              {
                icon: CheckCircle,
                title: 'Professional Background',
                requirements: [
                  'Employment history reviewed',
                  'Relevant qualifications documented',
                  'Care experience verified where possible',
                  'Professional references available to care homes',
                ],
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                </div>
                <ul className="space-y-2">
                  {item.requirements.map((req, reqIdx) => (
                    <li key={reqIdx} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification Process */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Our Verification Process</h2>
          <div className="space-y-6">
            {[
              {
                step: '1',
                title: 'Document Upload',
                description: 'Care professionals upload their DBS certificate, right to work documentation, and insurance policy via our secure platform.',
              },
              {
                step: '2',
                title: 'Manual Review',
                description: 'Our compliance team reviews all documents for authenticity and validity. We check certificate numbers, dates, and coverage.',
              },
              {
                step: '3',
                title: 'Update Service Check',
                description: 'For carers registered on the DBS Update Service, we perform online status checks to verify no new information exists.',
              },
              {
                step: '4',
                title: 'Ongoing Monitoring',
                description: 'We track expiry dates and prompt carers to renew documents before they expire. Profiles are suspended if documents lapse.',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Care Homes */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Information Available to Care Homes</h2>
          <p className="text-gray-300 text-center mb-8">
            When reviewing applicants, care homes can see verification status at a glance:
          </p>
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { label: 'DBS Status', value: 'Verified / On Update Service' },
                { label: 'DBS Issue Date', value: 'Visible' },
                { label: 'Right to Work', value: 'Confirmed' },
                { label: 'Insurance Status', value: 'Valid until [date]' },
                { label: 'Profile Verification', value: 'Fully Verified' },
                { label: 'Ratings & Reviews', value: 'From other care homes' },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">{item.label}</span>
                  <span className="text-teal-400 font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-gray-400 text-sm text-center mt-6">
            Care homes can request to view actual documents where their policies require it.
          </p>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Important Notice for Care Homes</h2>
              <div className="prose prose-gray">
                <p className="text-gray-600 mb-4">
                  While Clovia verifies compliance documents, care homes remain responsible for:
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li>Conducting their own recruitment due diligence as required by CQC</li>
                  <li>Ensuring staff are suitable for specific roles within their setting</li>
                  <li>Maintaining their own compliance records</li>
                  <li>Supervising and supporting temporary staff appropriately</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  Clovia facilitates the connection between care homes and self-employed care professionals.
                  We do not employ carers and do not act as their employer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Questions About Compliance?</h2>
          <p className="text-lg text-teal-100 mb-8">
            Our team is here to help with any compliance questions.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-teal-700 font-semibold rounded-lg hover:bg-teal-50 transition-colors"
          >
            Contact Us
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
