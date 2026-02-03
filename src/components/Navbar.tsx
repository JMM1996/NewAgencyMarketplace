'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface AppUser {
  id: string
  email: string
  role: 'CARE_STAFF' | 'CARE_HOME' | 'ADMIN'
}

export function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<AppUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    // Only run on the client side
    if (typeof window === 'undefined') return

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    // Fetch user with role from our API
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()
        setUser(data.user)
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()

    // Listen for auth changes and refetch user
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUser()
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const getDashboardLink = () => {
    if (!user) return '/login'
    return user.role === 'CARE_HOME' ? '/dashboard/care-home' : '/dashboard/staff'
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
            {/* Find Shifts - visible to non-logged in users and care staff only */}
            {(!user || user.role !== 'CARE_HOME') && (
              <Link href="/shifts" className="text-gray-600 hover:text-teal-600 transition-colors">
                Find Shifts
              </Link>
            )}
            {/* For Care Homes - visible to non-logged in users and care homes only */}
            {(!user || user.role !== 'CARE_STAFF') && (
              <Link href="/for-care-homes" className="text-gray-600 hover:text-teal-600 transition-colors">
                For Care Homes
              </Link>
            )}
            <Link href="/about" className="text-gray-600 hover:text-teal-600 transition-colors">
              About
            </Link>

            {isLoading ? (
              <div className="w-20 h-10 bg-gray-100 animate-pulse rounded-lg" />
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href={getDashboardLink()}
                  className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleSignOut}
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
            {/* Find Shifts - visible to non-logged in users and care staff only */}
            {(!user || user.role !== 'CARE_HOME') && (
              <Link
                href="/shifts"
                className="block text-gray-600 hover:text-teal-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Shifts
              </Link>
            )}
            {/* For Care Homes - visible to non-logged in users and care homes only */}
            {(!user || user.role !== 'CARE_STAFF') && (
              <Link
                href="/for-care-homes"
                className="block text-gray-600 hover:text-teal-600"
                onClick={() => setIsMenuOpen(false)}
              >
                For Care Homes
              </Link>
            )}
            <Link
              href="/about"
              className="block text-gray-600 hover:text-teal-600"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            {user ? (
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
                    handleSignOut()
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
