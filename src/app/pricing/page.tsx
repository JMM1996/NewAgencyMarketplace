import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Pricing | Clovia',
  description: 'Simple, transparent pricing for care homes. No hidden fees, no long-term contracts.',
}

export default function PricingPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto">
            No hidden fees. No long-term contracts. Pay only for the shifts you fill.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Care Homes */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-teal-600 text-white p-6">
                <h2 className="text-2xl font-bold">For Care Homes</h2>
                <p className="text-teal-100 mt-1">Fill shifts with vetted professionals</p>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <div className="text-4xl font-bold text-gray-900">
                    15%
                    <span className="text-lg font-normal text-gray-600"> platform fee</span>
                  </div>
                  <p className="text-gray-600 mt-2">
                    Added to the carer&apos;s rate. You see the total cost upfront before posting.
                  </p>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    'Post unlimited shifts',
                    'Access all vetted carers',
                    'View full carer profiles & ratings',
                    'Build a pool of favourite regulars',
                    'Manage bookings & timesheets',
                    'No subscription or setup fees',
                    'No minimum commitment',
                    'Cancel shifts for free (24hr+ notice)',
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register?type=home"
                  className="block w-full text-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Register Your Care Home
                </Link>
              </div>
            </div>

            {/* Care Staff */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gray-900 text-white p-6">
                <h2 className="text-2xl font-bold">For Care Staff</h2>
                <p className="text-gray-300 mt-1">Work flexibly on your terms</p>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <div className="text-4xl font-bold text-gray-900">
                    Free
                    <span className="text-lg font-normal text-gray-600"> to join</span>
                  </div>
                  <p className="text-gray-600 mt-2">
                    Create your profile and start applying for shifts at no cost.
                  </p>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    'Free profile creation',
                    'Browse all available shifts',
                    'Apply with one click',
                    'Set your own availability',
                    'Choose your preferred locations',
                    'Get paid weekly',
                    'Build your reputation with reviews',
                    'Work as a self-employed professional',
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register?type=staff"
                  className="block w-full text-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Join as Care Staff
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example Calculation */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Example Cost Breakdown</h2>
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-700">Healthcare Assistant rate</span>
                <span className="font-semibold text-gray-900">£19.50/hr</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-700">Platform fee (15%)</span>
                <span className="font-semibold text-gray-900">£2.93/hr</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-teal-50 -mx-6 px-6 rounded-lg">
                <span className="font-semibold text-gray-900">Total cost to care home</span>
                <span className="font-bold text-teal-600 text-xl">£22.43/hr</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Compare this to typical agency rates of £28-35/hr for the same role.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: 'Are there any setup or subscription fees?',
                a: 'No. Registration is completely free for both care homes and care staff. You only pay the platform fee when a shift is completed.',
              },
              {
                q: 'How do payments work?',
                a: 'Care homes are invoiced weekly for completed shifts. Carers are paid weekly directly to their bank account.',
              },
              {
                q: 'What if a carer cancels at short notice?',
                a: 'There is no charge if a carer cancels. We help you find replacement cover as quickly as possible.',
              },
              {
                q: 'Can I negotiate rates with carers?',
                a: 'You set the rate when posting a shift. Carers can see all available shifts and apply to those that meet their expectations.',
              },
              {
                q: 'Is there a minimum commitment?',
                a: 'No. Use Clovia as much or as little as you need. There are no contracts or minimum booking requirements.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-teal-100 mb-8 max-w-2xl mx-auto">
            Join Clovia today and start filling shifts with vetted care professionals.
          </p>
          <Link
            href="/register?type=home"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-teal-700 font-semibold rounded-lg hover:bg-teal-50 transition-colors"
          >
            Register Your Care Home
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
