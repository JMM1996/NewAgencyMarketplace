import Link from 'next/link'
import {
  Shield,
  Clock,
  Banknote,
  CheckCircle,
  ArrowRight,
  Users,
  FileCheck,
  AlertTriangle,
  Zap,
} from 'lucide-react'

export const metadata = {
  title: 'For Care Homes | Clovia',
  description: 'Fill shifts fast with fully vetted care professionals. No agency markups, just quality care.',
}

export default function ForCareHomesPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Fill Shifts with Vetted Care Professionals
            </h1>
            <p className="text-xl text-teal-100 mb-8">
              Stop paying agency markups. Access a pool of verified, insured care staff ready to work at your facility.
            </p>
            <Link
              href="/register?type=home"
              className="inline-flex items-center px-6 py-3 bg-white text-teal-700 font-semibold rounded-lg hover:bg-teal-50 transition-colors"
            >
              Register Your Care Home
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Agency Problem</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Traditional agencies charge significant markups while providing inconsistent service.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Banknote,
                title: 'High Agency Fees',
                description: 'Agencies often charge 30-50% markups on top of carer pay, eating into your budget.',
              },
              {
                icon: AlertTriangle,
                title: 'Unknown Staff',
                description: 'You never know who will turn up. Different faces every shift make continuity impossible.',
              },
              {
                icon: Clock,
                title: 'Last-Minute Let Downs',
                description: 'Agencies overbook and cancel on you when a better-paying facility needs cover.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Clovia Solution</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Direct access to self-employed care professionals. You set the rate, we handle the vetting.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Banknote,
                title: 'Transparent Pricing',
                description: 'Pay carers directly at rates you set. Our small platform fee is clearly shown upfront.',
              },
              {
                icon: Users,
                title: 'Build Your Team',
                description: 'Favourite reliable carers and build a pool of regulars who know your residents.',
              },
              {
                icon: Zap,
                title: 'Fill Shifts Fast',
                description: 'Post a shift and receive applications from verified carers within minutes.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-teal-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vetting Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Every Carer is Fully Vetted</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Before any carer can accept shifts on Clovia, we verify all compliance requirements.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: 'Enhanced DBS',
                description: 'Valid enhanced DBS check for regulated activity, verified against the Update Service where available.',
              },
              {
                icon: FileCheck,
                title: 'Right to Work',
                description: 'UK right to work documentation verified. Share codes checked directly with Home Office.',
              },
              {
                icon: Shield,
                title: 'Public Liability Insurance',
                description: 'All self-employed carers must hold valid public liability insurance.',
              },
              {
                icon: CheckCircle,
                title: 'References & Qualifications',
                description: 'Employment history verified. Relevant care qualifications documented and checked.',
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-14 h-14 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Getting Started is Simple</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Register', description: 'Create your care home profile with CQC details' },
              { step: '2', title: 'Post Shifts', description: 'Add shifts with your requirements and rates' },
              { step: '3', title: 'Review Applicants', description: 'See full profiles, ratings, and verification status' },
              { step: '4', title: 'Confirm & Manage', description: 'Book carers and manage your schedule' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Staffing?</h2>
          <p className="text-lg text-teal-100 mb-8 max-w-2xl mx-auto">
            Join care homes across the UK who are saving money and getting better care with Clovia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register?type=home"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-teal-700 font-semibold rounded-lg hover:bg-teal-50 transition-colors"
            >
              Register Your Care Home
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-8 py-4 bg-teal-700 text-white font-semibold rounded-lg border-2 border-teal-500 hover:bg-teal-800 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
