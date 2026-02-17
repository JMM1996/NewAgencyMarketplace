import { Mail, MessageSquare, Clock } from 'lucide-react'

export const metadata = {
  title: 'Contact Us | Clovia',
  description: 'Get in touch with the Clovia team. We\'re here to help.',
}

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto">
            Have a question or need support? We&apos;re here to help.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: Mail,
                title: 'Email Support',
                description: 'Send us an email and we\'ll respond within 24 hours.',
                contact: 'support@clovia.uk',
                href: 'mailto:support@clovia.uk',
              },
              {
                icon: MessageSquare,
                title: 'Live Chat',
                description: 'Chat with our team during business hours.',
                contact: 'Available 9am - 6pm',
                href: '#',
              },
              {
                icon: Clock,
                title: 'Response Time',
                description: 'We aim to respond to all enquiries promptly.',
                contact: 'Within 24 hours',
                href: null,
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-teal-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h2>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-teal-600 font-medium hover:text-teal-700"
                  >
                    {item.contact}
                  </a>
                ) : (
                  <span className="text-teal-600 font-medium">{item.contact}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Send us a message</h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
                I am a...
              </label>
              <select
                id="userType"
                name="userType"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">Please select</option>
                <option value="care_staff">Care Professional</option>
                <option value="care_home">Care Home</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">Please select</option>
                <option value="general">General enquiry</option>
                <option value="account">Account help</option>
                <option value="verification">Verification question</option>
                <option value="payment">Payment issue</option>
                <option value="shift">Shift or booking issue</option>
                <option value="feedback">Feedback or suggestion</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                placeholder="How can we help?"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
            >
              Send Message
            </button>

            <p className="text-sm text-gray-500 text-center">
              By submitting this form, you agree to our{' '}
              <a href="/privacy" className="text-teal-600 hover:underline">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </section>

      {/* Office Info */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Registered Office</h2>
          <p className="text-gray-600">
            Clovia Ltd<br />
            Registered in England & Wales<br />
          </p>
        </div>
      </section>
    </div>
  )
}
