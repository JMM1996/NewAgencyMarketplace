'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react'

export function Navbar() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const getDashboardLink = () => {
    if (!session) return '/login'
    return session.user.role === 'CARE_HOME' ? '/dashboard/care-home' : '/dashboard/staff'
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900">CareConnect</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/shifts" className="text-gray-600 hover:text-teal-600 transition-colors">
              Find Shifts
            </Link>
            <Link href="/for-care-homes" className="text-gray-600 hover:text-teal-600 transition-colors">
              For Care Homes
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-teal-600 transition-colors">
              About
            </Link>

            {status === 'loading' ? (
              <div className="w-20 h-10 bg-gray-100 animate-pulse rounded-lg" />
            ) : session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href={getDashboardLink()}
                  className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-4">
            <Link
              href="/shifts"
              className="block text-gray-600 hover:text-teal-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Shifts
            </Link>
            <Link
              href="/for-care-homes"
              className="block text-gray-600 hover:text-teal-600"
              onClick={() => setIsMenuOpen(false)}
            >
              For Care Homes
            </Link>
            <Link
              href="/about"
              className="block text-gray-600 hover:text-teal-600"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            {session ? (
              <>
                <Link
                  href={getDashboardLink()}
                  className="block text-gray-600 hover:text-teal-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: '/' })
                    setIsMenuOpen(false)
                  }}
                  className="block text-red-600 hover:text-red-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-gray-600 hover:text-teal-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="block bg-teal-600 text-white px-4 py-2 rounded-lg text-center hover:bg-teal-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
