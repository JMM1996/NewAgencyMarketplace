import Link from 'next/link'
import { ArrowRight, TrendingUp, Clock, Shield } from 'lucide-react'

export const metadata = {
  title: 'Pay Rates | Clovia',
  description: 'Competitive pay rates for self-employed care professionals. See what you could earn.',
}

export default function RatesPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Earn What You Deserve
          </h1>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto">
            As a self-employed care professional on Clovia, you set your worth. Here&apos;s what carers are earning.
          </p>
        </div>
      </section>

      {/* Rate Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Typical Hourly Rates</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                role: 'Healthcare Assistant',
                range: '£17 - £22',
                typical: '£19.50',
                description: 'Personal care, daily activities support, companionship',
              },
              {
                role: 'Senior Carer',
                range: '£19 - £25',
                typical: '£21.00',
                description: 'Team leadership, medication administration, care planning',
              },
              {
                role: 'Registered Nurse',
                range: '£25 - £35',
                typical: '£28.00',
                description: 'Clinical care, assessments, complex health needs',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.role}</h3>
                <div className="text-3xl font-bold text-teal-600 mb-1">{item.typical}</div>
                <div className="text-sm text-gray-500 mb-4">Typical rate (range: {item.range})</div>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 text-sm mt-6">
            Rates vary by location, experience, and shift type. Night and weekend shifts often attract premium rates.
          </p>
        </div>
      </section>

      {/* Shift Premiums */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Shift Premiums</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { type: 'Day Shift', premium: 'Standard', time: '7am - 7pm' },
              { type: 'Night Shift', premium: '+10-20%', time: '7pm - 7am' },
              { type: 'Weekend', premium: '+10-15%', time: 'Sat & Sun' },
              { type: 'Bank Holiday', premium: '+25-50%', time: 'Public holidays' },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">{item.time}</div>
                <div className="font-semibold text-gray-900">{item.type}</div>
                <div className="text-teal-600 font-bold mt-2">{item.premium}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Clovia vs Traditional Employment</h2>
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 text-gray-400 font-medium"></th>
                  <th className="text-center p-4 text-teal-400 font-medium">Clovia</th>
                  <th className="text-center p-4 text-gray-400 font-medium">Agency</th>
                  <th className="text-center p-4 text-gray-400 font-medium">Employed</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Typical HCA Rate', clovia: '£19.50/hr', agency: '£12-14/hr', employed: '£11-13/hr' },
                  { label: 'Choose Your Shifts', clovia: '✓', agency: 'Limited', employed: '✗' },
                  { label: 'Weekly Pay', clovia: '✓', agency: '✓', employed: 'Monthly' },
                  { label: 'Holiday Pay', clovia: 'Built into rate', agency: 'Often missing', employed: '✓' },
                  { label: 'Pension', clovia: 'Self-managed', agency: 'Varies', employed: '✓' },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-700">
                    <td className="p-4 text-gray-300">{row.label}</td>
                    <td className="p-4 text-center text-teal-400">{row.clovia}</td>
                    <td className="p-4 text-center text-gray-400">{row.agency}</td>
                    <td className="p-4 text-center text-gray-400">{row.employed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-400 text-sm text-center mt-6">
            As a self-employed professional, you&apos;re responsible for your own tax, national insurance, and pension contributions.
            We recommend speaking to an accountant about the benefits of self-employment.
          </p>
        </div>
      </section>

      {/* Tips */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Maximise Your Earnings</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'Complete Your Profile',
                description: 'Carers with complete profiles and verified documents get more bookings.',
              },
              {
                icon: TrendingUp,
                title: 'Build Your Reputation',
                description: 'Great reviews lead to more bookings and the ability to command higher rates.',
              },
              {
                icon: Clock,
                title: 'Be Reliable',
                description: 'Care homes favourite reliable carers, giving you first access to shifts.',
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-lg text-teal-100 mb-8">
            Join Clovia today and take control of your care career.
          </p>
          <Link
            href="/register?type=staff"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-teal-700 font-semibold rounded-lg hover:bg-teal-50 transition-colors"
          >
            Create Your Profile
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
