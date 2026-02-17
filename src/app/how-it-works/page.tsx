import Link from 'next/link'
import {
  Users,
  Calendar,
  Banknote,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  FileCheck,
  Star,
} from 'lucide-react'

export const metadata = {
  title: 'How It Works | Clovia',
  description: 'Learn how Clovia connects care homes with verified care professionals.',
}

export default function HowItWorksPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How Clovia Works
          </h1>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto">
            A simple, transparent marketplace connecting care homes with self-employed care professionals.
          </p>
        </div>
      </section>

      {/* For Care Staff */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-4">
              For Care Staff
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Work on Your Terms</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Take control of your career with flexible shifts, competitive rates, and the freedom of self-employment.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {[
              {
                step: '1',
                icon: Users,
                title: 'Create Your Profile',
                description: 'Sign up for free and build your professional profile. Add your experience, qualifications, and preferred working areas.',
              },
              {
                step: '2',
                icon: FileCheck,
                title: 'Get Verified',
                description: 'Upload your DBS certificate, right to work documents, and public liability insurance. We verify everything before you can apply for shifts.',
              },
              {
                step: '3',
                icon: Calendar,
                title: 'Find & Book Shifts',
                description: 'Browse available shifts in your area. See rates, locations, and requirements upfront. Apply with one click.',
              },
              {
                step: '4',
                icon: Banknote,
                title: 'Work & Get Paid',
                description: 'Complete your shifts, build your reputation with reviews, and get paid weekly directly to your bank account.',
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-teal-600" />
                </div>
                <div className="text-sm text-teal-600 font-semibold mb-2">Step {item.step}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Benefits for Care Staff</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Banknote, title: 'Higher Earnings', description: 'Keep more of what you earn with no agency cuts. Set rates that reflect your experience.' },
                { icon: Clock, title: 'Flexible Schedule', description: 'Work when and where you want. No minimum hours, no fixed rotas.' },
                { icon: Star, title: 'Build Your Reputation', description: 'Collect reviews from care homes and become a sought-after professional.' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/register?type=staff"
              className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
            >
              Join as Care Staff
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* For Care Homes */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium mb-4">
              For Care Homes
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Fill Shifts with Confidence</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Access a pool of fully vetted care professionals without the agency markup.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {[
              {
                step: '1',
                icon: Shield,
                title: 'Register Your Home',
                description: 'Create your care home profile with CQC details, specializations, and requirements. Registration is free.',
              },
              {
                step: '2',
                icon: Calendar,
                title: 'Post Shifts',
                description: 'Add shifts with your requirements, rates, and timing. Only verified carers can view and apply.',
              },
              {
                step: '3',
                icon: Users,
                title: 'Review Applicants',
                description: 'See complete profiles including experience, qualifications, ratings, and verification status.',
              },
              {
                step: '4',
                icon: CheckCircle,
                title: 'Confirm & Build',
                description: 'Confirm bookings, favourite reliable carers, and build a pool of trusted regulars.',
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-sm text-teal-600 font-semibold mb-2">Step {item.step}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Benefits for Care Homes</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Banknote, title: 'Lower Costs', description: 'Save up to 40% compared to traditional agencies with our transparent 15% platform fee.' },
                { icon: Shield, title: 'Fully Vetted Staff', description: 'Every carer has verified DBS, right to work, insurance, and references.' },
                { icon: Users, title: 'Consistent Care', description: 'Build relationships with regular carers who know your residents and routines.' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/register?type=home"
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Register Your Care Home
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-teal-100 mb-8">
            Join Clovia today and experience a better way to connect care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register?type=staff"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-teal-700 font-semibold rounded-lg hover:bg-teal-50 transition-colors"
            >
              I&apos;m a Care Professional
            </Link>
            <Link
              href="/register?type=home"
              className="inline-flex items-center justify-center px-8 py-4 bg-teal-700 text-white font-semibold rounded-lg border-2 border-teal-500 hover:bg-teal-800 transition-colors"
            >
              I&apos;m a Care Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
