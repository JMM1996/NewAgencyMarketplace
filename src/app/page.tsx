import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Shield,
  Clock,
  Banknote,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  MapPin,
  Calendar,
} from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'

export default async function Home() {
  // Redirect logged-in users to their dashboard
  const user = await getCurrentUser()
  if (user) {
    if (user.role === 'CARE_HOME') {
      redirect('/dashboard/care-home')
    } else if (user.role === 'CARE_STAFF') {
      redirect('/dashboard/staff')
    }
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-600 to-teal-800 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Connect Care Homes with Qualified Care Professionals
              </h1>
              <p className="text-lg md:text-xl text-teal-100 mb-8">
                The UK&apos;s trusted marketplace for self-employed care staff and care homes.
                Fill shifts instantly, work flexibly, and deliver exceptional care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register?type=staff"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-teal-700 font-semibold rounded-lg hover:bg-teal-50 transition-colors"
                >
                  Find Care Work
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="/register?type=home"
                  className="inline-flex items-center justify-center px-6 py-3 bg-teal-700 text-white font-semibold rounded-lg border-2 border-teal-500 hover:bg-teal-600 transition-colors"
                >
                  Post Shifts
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="space-y-4">
                  {/* Sample shift cards */}
                  {[
                    { role: 'Healthcare Assistant', location: 'Manchester', rate: '19.50', time: 'Day Shift' },
                    { role: 'Registered Nurse', location: 'Birmingham', rate: '28.00', time: 'Night Shift' },
                    { role: 'Senior Carer', location: 'Leeds', rate: '21.00', time: 'Long Day' },
                  ].map((shift, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4 text-gray-900">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{shift.role}</h3>
                        <span className="text-teal-600 font-bold">£{shift.rate}/hr</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {shift.location}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {shift.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Trust Section - Care Home Focused */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Every Carer is Fully Vetted</h2>
            <p className="text-gray-600">Before any carer can accept shifts, we verify:</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Enhanced DBS', description: 'Valid enhanced DBS check for regulated activity' },
              { icon: CheckCircle, title: 'Right to Work', description: 'UK right to work documentation verified' },
              { icon: Shield, title: 'Public Liability', description: 'Valid insurance for self-employed carers' },
              { icon: Users, title: 'References', description: 'Employment history and qualifications checked' },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Care Homes */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works for Care Homes</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fill shifts fast with fully vetted care professionals. No agency markups, just
              quality care when you need it.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Register Your Home',
                description:
                  'Create your care home profile, add your CQC details, and set your requirements. Takes under 10 minutes.',
                icon: Shield,
              },
              {
                step: '2',
                title: 'Post Shifts',
                description:
                  'Create shifts with your rates and requirements. Only verified carers with valid DBS, Right to Work, and Insurance can apply.',
                icon: Clock,
              },
              {
                step: '3',
                title: 'Confirm & Manage',
                description:
                  'Review applicant profiles, confirm bookings, and build a reliable pool of trusted regulars.',
                icon: CheckCircle,
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm text-teal-600 font-semibold mb-2">Step {item.step}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/register?type=home"
              className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
            >
              Register Your Care Home
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works - Care Staff */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works for Care Staff</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Take control of your career. Work when you want, where you want, at rates you deserve.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Create Your Profile',
                description:
                  'Sign up, upload your DBS and qualifications, and set your availability and preferred locations.',
                icon: Users,
              },
              {
                step: '2',
                title: 'Browse & Book Shifts',
                description:
                  'Find shifts that match your skills and schedule. Apply with one click and get confirmed instantly.',
                icon: Calendar,
              },
              {
                step: '3',
                title: 'Work & Get Paid',
                description:
                  'Complete your shift, receive reviews, and get paid weekly directly to your bank account.',
                icon: Banknote,
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-teal-600" />
                </div>
                <div className="text-sm text-teal-600 font-semibold mb-2">Step {item.step}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/register?type=staff"
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Start Finding Shifts
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Clovia?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Verified Professionals',
                description: 'All care staff are DBS checked with verified qualifications and right to work.',
                icon: Shield,
              },
              {
                title: 'Flexible Working',
                description: 'Choose your own hours, locations, and rates. True self-employment.',
                icon: Clock,
              },
              {
                title: 'Competitive Rates',
                description: 'Earn more as a self-employed carer. No middleman taking large cuts.',
                icon: Banknote,
              },
              {
                title: 'Quality Care',
                description: 'Rating system ensures only the best carers and care homes thrive.',
                icon: Star,
              },
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="w-5 h-5 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Care Staffing?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of care professionals and care homes already using Clovia to deliver
            exceptional care across the UK.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register?type=staff"
              className="inline-flex items-center justify-center px-8 py-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-500 transition-colors"
            >
              I&apos;m a Care Professional
            </Link>
            <Link
              href="/register?type=home"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              I&apos;m a Care Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
