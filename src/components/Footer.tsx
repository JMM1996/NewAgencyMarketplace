import Link from 'next/link'
import { Clover } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <Clover className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Clovia</span>
            </div>
            <p className="text-sm text-gray-400">
              Connecting care homes with qualified, self-employed care professionals across the UK.
            </p>
          </div>

          {/* For Care Staff */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Care Staff</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shifts" className="hover:text-teal-400 transition-colors">
                  Find Shifts
                </Link>
              </li>
              <li>
                <Link href="/register?type=staff" className="hover:text-teal-400 transition-colors">
                  Join as Carer
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-teal-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/rates" className="hover:text-teal-400 transition-colors">
                  Pay Rates
                </Link>
              </li>
            </ul>
          </div>

          {/* For Care Homes */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Care Homes</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/for-care-homes" className="hover:text-teal-400 transition-colors">
                  Why Clovia
                </Link>
              </li>
              <li>
                <Link href="/register?type=home" className="hover:text-teal-400 transition-colors">
                  Register Your Home
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-teal-400 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="hover:text-teal-400 transition-colors">
                  Compliance
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="hover:text-teal-400 transition-colors">
                  Help Centre
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-teal-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-teal-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-teal-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} Clovia. All rights reserved.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span>Registered in England & Wales</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
