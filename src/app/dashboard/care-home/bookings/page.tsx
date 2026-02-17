import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Banknote,
  AlertCircle,
  CheckCircle,
  Users,
} from 'lucide-react'
import { format } from 'date-fns'

export default async function CareHomeBookingsPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'CARE_HOME') {
    redirect('/login')
  }

  const careHome = await prisma.careHome.findUnique({
    where: { userId: user.id },
  })

  if (!careHome) {
    redirect('/onboarding/care-home')
  }

  // Get all pending bookings for this care home's shifts
  const pendingBookings = await prisma.booking.findMany({
    where: {
      shift: {
        careHomeId: careHome.id,
      },
      status: 'PENDING',
    },
    include: {
      shift: true,
      careStaff: {
        select: {
          firstName: true,
          lastName: true,
          staffType: true,
          yearsExperience: true,
        },
      },
    },
    orderBy: { appliedAt: 'asc' },
  })

  // Group bookings by shift
  const bookingsByShift = pendingBookings.reduce((acc, booking) => {
    const shiftId = booking.shiftId
    if (!acc[shiftId]) {
      acc[shiftId] = {
        shift: booking.shift,
        bookings: [],
      }
    }
    acc[shiftId].bookings.push(booking)
    return acc
  }, {} as Record<string, { shift: typeof pendingBookings[0]['shift']; bookings: typeof pendingBookings }>)

  const shiftsWithPendingBookings = Object.values(bookingsByShift)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/dashboard/care-home"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Booking Requests</h1>
        <p className="text-gray-600 mt-1">Review and respond to staff applications</p>
      </div>

      {shiftsWithPendingBookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-gray-500 mb-4">
            You have no pending booking requests to review.
          </p>
          <Link
            href="/dashboard/care-home"
            className="text-teal-600 font-semibold hover:text-teal-700"
          >
            Back to Dashboard
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {shiftsWithPendingBookings.map(({ shift, bookings }) => (
            <div key={shift.id} className="bg-white rounded-xl shadow-sm border border-gray-100">
              {/* Shift Header */}
              <div className="p-6 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-900">{shift.title}</h2>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(new Date(shift.date), 'EEE, d MMM yyyy')}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {shift.startTime} - {shift.endTime}
                      </span>
                      <span className="flex items-center">
                        <Banknote className="w-4 h-4 mr-1" />
                        £{shift.hourlyRate.toString()}/hr
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-amber-600">
                    <Users className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      {bookings.length} applicant{bookings.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Applicants List */}
              <div className="divide-y divide-gray-100">
                {bookings.map((booking) => (
                  <div key={booking.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                          <span className="text-teal-700 font-semibold">
                            {booking.careStaff.firstName[0]}{booking.careStaff.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {booking.careStaff.firstName} {booking.careStaff.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {booking.careStaff.staffType.replace(/_/g, ' ')} • {booking.careStaff.yearsExperience} years exp
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Applied {format(new Date(booking.appliedAt), 'd MMM, HH:mm')}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/dashboard/care-home/shifts/${shift.id}`}
                        className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        Review
                      </Link>
                    </div>
                    {booking.staffNotes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 italic">&quot;{booking.staffNotes}&quot;</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
