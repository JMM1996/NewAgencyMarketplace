import Link from 'next/link'
import { Search, ChevronRight, Users, Building2, Shield, Banknote, Calendar, HelpCircle } from 'lucide-react'

export const metadata = {
  title: 'Help Centre | Clovia',
  description: 'Find answers to common questions about using Clovia.',
}

export default function HelpPage() {
  const categories = [
    {
      icon: Users,
      title: 'For Care Staff',
      description: 'Getting started, finding shifts, payments',
      articles: [
        { title: 'How do I create my profile?', href: '#' },
        { title: 'What documents do I need to upload?', href: '#' },
        { title: 'How do I apply for shifts?', href: '#' },
        { title: 'When and how do I get paid?', href: '#' },
        { title: 'How do reviews work?', href: '#' },
      ],
    },
    {
      icon: Building2,
      title: 'For Care Homes',
      description: 'Posting shifts, managing bookings, billing',
      articles: [
        { title: 'How do I register my care home?', href: '#' },
        { title: 'How do I post a shift?', href: '#' },
        { title: 'How do I review applicants?', href: '#' },
        { title: 'What verification do carers have?', href: '/compliance' },
        { title: 'How does billing work?', href: '#' },
      ],
    },
    {
      icon: Shield,
      title: 'Compliance & Verification',
      description: 'DBS, right to work, insurance requirements',
      articles: [
        { title: 'What DBS check do I need?', href: '#' },
        { title: 'How do I register for the DBS Update Service?', href: '/dbs-application' },
        { title: 'What right to work documents are accepted?', href: '#' },
        { title: 'Do I need public liability insurance?', href: '#' },
        { title: 'How long does verification take?', href: '#' },
      ],
    },
    {
      icon: Banknote,
      title: 'Payments & Pricing',
      description: 'Rates, fees, invoicing, payouts',
      articles: [
        { title: 'What fees does Clovia charge?', href: '/pricing' },
        { title: 'How do care home payments work?', href: '#' },
        { title: 'When are carers paid?', href: '#' },
        { title: 'What payment methods are accepted?', href: '#' },
        { title: 'How do I update my bank details?', href: '#' },
      ],
    },
    {
      icon: Calendar,
      title: 'Shifts & Bookings',
      description: 'Applying, confirming, cancelling shifts',
      articles: [
        { title: 'How do I cancel a shift?', href: '#' },
        { title: 'What is the cancellation policy?', href: '#' },
        { title: 'How do check-in and check-out work?', href: '#' },
        { title: 'What if I\'m running late?', href: '#' },
        { title: 'How do I report an issue with a shift?', href: '#' },
      ],
    },
    {
      icon: HelpCircle,
      title: 'Account & Technical',
      description: 'Login, settings, technical issues',
      articles: [
        { title: 'How do I reset my password?', href: '#' },
        { title: 'How do I update my profile?', href: '#' },
        { title: 'How do I change my email address?', href: '#' },
        { title: 'How do I delete my account?', href: '#' },
        { title: 'The app isn\'t working - what should I do?', href: '#' },
      ],
    },
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How can we help?
          </h1>
          <p className="text-xl text-teal-100 mb-8">
            Search our help centre or browse topics below
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: 'Getting Started', href: '#' },
              { label: 'Payments', href: '#' },
              { label: 'Compliance', href: '/compliance' },
              { label: 'Contact Support', href: '/contact' },
            ].map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors shadow-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{category.title}</h2>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {category.articles.map((article, articleIdx) => (
                    <li key={articleIdx}>
                      <Link
                        href={article.href}
                        className="flex items-center justify-between py-2 text-sm text-gray-700 hover:text-teal-600 transition-colors group"
                      >
                        <span>{article.title}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Can&apos;t find what you&apos;re looking for?</h2>
          <p className="text-gray-600 mb-8">
            Our support team is here to help. Get in touch and we&apos;ll respond as soon as possible.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
          >
            Contact Support
            <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
