import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Banknote,
  MapPin,
  User,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
} from 'lucide-react'
import { format } from 'date-fns'
import { BookingActions } from './BookingActions'

export default async function CareHomeShiftDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()

  if (!user || user.role !== 'CARE_HOME') {
    redirect('/login')
  }

  // Get care home
  const careHome = await prisma.careHome.findUnique({
    where: { userId: user.id },
  })

  if (!careHome) {
    redirect('/login')
  }

  // Get shift with bookings
  const shift = await prisma.shift.findUnique({
    where: { id, careHomeId: careHome.id },
    include: {
      bookings: {
        include: {
          careStaff: {
            include: {
              user: {
                select: { email: true },
              },
            },
          },
        },
        orderBy: { appliedAt: 'asc' },
      },
    },
  })

  if (!shift) {
    notFound()
  }

  const pendingBookings = shift.bookings.filter((b) => b.status === 'PENDING')
  const confirmedBooking = shift.bookings.find((b) => b.status === 'CONFIRMED')
  const rejectedBookings = shift.bookings.filter((b) => b.status === 'REJECTED')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/dashboard/care-home"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      {/* Shift Details Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{shift.title}</h1>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  shift.status === 'OPEN'
                    ? 'bg-blue-100 text-blue-700'
                    : shift.status === 'FILLED'
                    ? 'bg-green-100 text-green-700'
                    : shift.status === 'COMPLETED'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {shift.status}
              </span>
            </div>
            <p className="text-gray-600">{shift.requiredRole.replace(/_/g, ' ')}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{format(new Date(shift.date), 'EEE, d MMM yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{shift.startTime} - {shift.endTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Banknote className="w-4 h-4 text-gray-400" />
            <span>{shift.hourlyRate.toString()}/hr</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{shift.shiftType.replace(/_/g, ' ')}</span>
          </div>
        </div>

        {shift.description && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">{shift.description}</p>
          </div>
        )}
      </div>

      {/* Confirmed Booking */}
      {confirmedBooking && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-green-800">Shift Filled</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {confirmedBooking.careStaff.firstName} {confirmedBooking.careStaff.lastName}
              </p>
              <p className="text-sm text-gray-600">{confirmedBooking.careStaff.user.email}</p>
              {confirmedBooking.careStaff.phone && (
                <p className="text-sm text-gray-600">{confirmedBooking.careStaff.phone}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pending Applicants */}
      {shift.status === 'OPEN' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Applicants ({pendingBookings.length})
              </h2>
              {pendingBookings.length > 0 && (
                <span className="text-sm text-amber-600 font-medium">
                  Awaiting your response
                </span>
              )}
            </div>
          </div>

          {pendingBookings.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applicants Yet</h3>
              <p className="text-gray-500">
                Care workers will appear here when they apply for this shift.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {pendingBookings.map((booking) => (
                <div key={booking.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {booking.careStaff.firstName} {booking.careStaff.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.careStaff.staffType.replace(/_/g, ' ')}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                          {booking.careStaff.yearsExperience > 0 && (
                            <span className="text-gray-600">
                              {booking.careStaff.yearsExperience} years exp.
                            </span>
                          )}
                          {booking.careStaff.averageRating && (
                            <span className="flex items-center text-gray-600">
                              <Star className="w-4 h-4 text-amber-400 fill-current mr-1" />
                              {booking.careStaff.averageRating.toString()}
                            </span>
                          )}
                          {booking.careStaff.dbsVerified && (
                            <span className="flex items-center text-green-600">
                              <Shield className="w-4 h-4 mr-1" />
                              DBS Verified
                            </span>
                          )}
                        </div>
                        {booking.staffNotes && (
                          <p className="mt-2 text-sm text-gray-600 italic">
                            &quot;{booking.staffNotes}&quot;
                          </p>
                        )}
                        <p className="mt-2 text-xs text-gray-400">
                          Applied {format(new Date(booking.appliedAt), 'd MMM yyyy, HH:mm')}
                        </p>
                      </div>
                    </div>

                    <BookingActions
                      bookingId={booking.id}
                      shiftId={shift.id}
                      staffName={`${booking.careStaff.firstName} ${booking.careStaff.lastName}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Rejected Applicants */}
      {rejectedBookings.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-500">
              Rejected ({rejectedBookings.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {rejectedBookings.map((booking) => (
              <div key={booking.id} className="p-6 opacity-60">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">
                      {booking.careStaff.firstName} {booking.careStaff.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.careStaff.staffType.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
