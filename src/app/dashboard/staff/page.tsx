import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Banknote,
  CheckCircle,
  Star,
  AlertCircle,
  TrendingUp,
} from 'lucide-react'
import { format } from 'date-fns'
import { EarningsSection } from './EarningsSection'

export default async function StaffDashboard() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'CARE_STAFF') {
    redirect('/login')
  }

  // Get care staff profile
  const careStaff = await prisma.careStaff.findUnique({
    where: { userId: user.id },
    include: {
      bookings: {
        where: {
          shift: {
            date: { gte: new Date() },
          },
        },
        orderBy: { shift: { date: 'asc' } },
        take: 5,
        include: {
          shift: {
            include: {
              careHome: true,
            },
          },
        },
      },
    },
  })

  if (!careStaff) {
    redirect('/login')
  }

  // Get booking stats
  const bookingStats = await prisma.booking.groupBy({
    by: ['status'],
    where: { careStaffId: careStaff.id },
    _count: true,
  })

  const confirmedBookings = bookingStats.find((s) => s.status === 'CONFIRMED')?._count || 0
  const completedBookings = bookingStats.find((s) => s.status === 'COMPLETED')?._count || 0
  const pendingBookings = bookingStats.find((s) => s.status === 'PENDING')?._count || 0

  // Get available shifts count
  const availableShifts = await prisma.shift.count({
    where: {
      status: 'OPEN',
      date: { gte: new Date() },
    },
  })

  // Check profile completion
  const profileComplete =
    careStaff.dbsVerified && careStaff.phone && careStaff.postcode

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {careStaff.firstName}
          </h1>
          <p className="text-gray-600 mt-1">Find shifts and manage your bookings</p>
        </div>
        <Link
          href="/shifts"
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Search className="w-5 h-5 mr-2" />
          Find Shifts
        </Link>
      </div>

      {/* Profile Completion Alert */}
      {!profileComplete && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800">Complete your profile to apply for shifts</p>
            <p className="text-sm text-amber-700 mt-1">
              Add your phone number, postcode, and verify your DBS to start working.
            </p>
            <Link
              href="/dashboard/staff/profile"
              className="text-sm font-semibold text-amber-800 hover:text-amber-900 mt-2 inline-block"
            >
              Complete Profile &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Available Shifts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{availableShifts}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{pendingBookings}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{confirmedBookings}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{completedBookings}</p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-teal-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Rating Card */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-teal-100 text-sm">Your Rating</p>
            <div className="flex items-center gap-2 mt-1">
              <Star className="w-6 h-6 fill-current" />
              <span className="text-3xl font-bold">
                {careStaff.averageRating?.toString() || 'N/A'}
              </span>
              <span className="text-teal-100">
                ({careStaff.totalReviews} review{careStaff.totalReviews !== 1 ? 's' : ''})
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-teal-100 text-sm">Shifts Completed</p>
            <p className="text-3xl font-bold mt-1">{careStaff.totalShiftsCompleted}</p>
          </div>
        </div>
      </div>

      {/* Earnings Section */}
      <div className="mb-8">
        <EarningsSection />
      </div>

      {/* Upcoming Shifts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Your Upcoming Shifts</h2>
            <Link
              href="/dashboard/staff/bookings"
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              View All
            </Link>
          </div>
        </div>

        {careStaff.bookings.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Shifts</h3>
            <p className="text-gray-500 mb-4">Browse available shifts and start applying</p>
            <Link
              href="/shifts"
              className="inline-flex items-center px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Search className="w-5 h-5 mr-2" />
              Find Shifts
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {careStaff.bookings.map((booking) => (
              <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{booking.shift.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          booking.status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-700'
                            : booking.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{booking.shift.careHome.name}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(new Date(booking.shift.date), 'EEE, d MMM yyyy')}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {booking.shift.startTime} - {booking.shift.endTime}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {booking.shift.careHome.city}
                      </span>
                      <span className="flex items-center">
                        <Banknote className="w-4 h-4 mr-1" />
                        {booking.agreedRate.toString()}/hr
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/staff/bookings/${booking.id}`}
                    className="px-4 py-2 text-sm font-medium text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
