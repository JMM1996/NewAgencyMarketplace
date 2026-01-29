'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, CheckCircle, Clock, XCircle, Send } from 'lucide-react'

interface ApplyButtonProps {
  shiftId: string
  isLoggedIn: boolean
  isCareStaff: boolean
  hasApplied: boolean
  bookingStatus?: string
  shiftStatus: string
}

export function ApplyButton({
  shiftId,
  isLoggedIn,
  isCareStaff,
  hasApplied,
  bookingStatus,
  shiftStatus,
}: ApplyButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleApply = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shiftId }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to apply')
      }

      setSuccess(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply')
    } finally {
      setIsLoading(false)
    }
  }

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <p className="text-gray-600 text-center mb-4">
          Sign in to apply for this shift
        </p>
        <Link
          href={`/login?callbackUrl=/shifts/${shiftId}`}
          className="block w-full py-3 px-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors text-center"
        >
          Sign In to Apply
        </Link>
        <p className="text-sm text-gray-500 text-center mt-4">
          New to CareConnect?{' '}
          <Link href="/register?type=staff" className="text-teal-600 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    )
  }

  // Not care staff
  if (!isCareStaff) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <p className="text-gray-600">
          Only care staff can apply for shifts
        </p>
      </div>
    )
  }

  // Shift not open
  if (shiftStatus !== 'OPEN') {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <XCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">
          This shift is no longer available
        </p>
      </div>
    )
  }

  // Already applied
  if (hasApplied || success) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
        {bookingStatus === 'CONFIRMED' || success ? (
          <>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {success ? 'Application Submitted!' : 'Booking Confirmed'}
            </h3>
            <p className="text-sm text-gray-500">
              {success
                ? 'The care home will review your application.'
                : 'You are booked for this shift.'}
            </p>
          </>
        ) : bookingStatus === 'REJECTED' ? (
          <>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Application Declined</h3>
            <p className="text-sm text-gray-500">
              Unfortunately, your application was not accepted.
            </p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Application Pending</h3>
            <p className="text-sm text-gray-500">
              Waiting for the care home to review your application.
            </p>
          </>
        )}
        <Link
          href="/dashboard/staff"
          className="inline-block mt-4 text-teal-600 font-medium hover:text-teal-700"
        >
          View in Dashboard &rarr;
        </Link>
      </div>
    )
  }

  // Can apply
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      <button
        onClick={handleApply}
        disabled={isLoading}
        className="w-full py-3 px-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Applying...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Apply for This Shift
          </>
        )}
      </button>
      <p className="text-xs text-gray-500 text-center mt-3">
        By applying, you confirm you meet the role requirements
      </p>
    </div>
  )
}
