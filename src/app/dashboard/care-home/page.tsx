import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import {
  Plus,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Banknote,
} from 'lucide-react'
import { format } from 'date-fns'

export default async function CareHomeDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'CARE_HOME') {
    redirect('/login')
  }

  // Get care home profile
  const careHome = await prisma.careHome.findUnique({
    where: { userId: session.user.id },
    include: {
      shifts: {
        where: {
          date: { gte: new Date() },
        },
        orderBy: { date: 'asc' },
        take: 5,
        include: {
          bookings: {
            include: {
              careStaff: true,
            },
          },
        },
      },
    },
  })

  if (!careHome) {
    redirect('/login')
  }

  // Get stats
  const stats = await prisma.shift.groupBy({
    by: ['status'],
    where: { careHomeId: careHome.id },
    _count: true,
  })

  const openShifts = stats.find((s) => s.status === 'OPEN')?._count || 0
  const filledShifts = stats.find((s) => s.status === 'FILLED')?._count || 0
  const completedShifts = stats.find((s) => s.status === 'COMPLETED')?._count || 0

  // Get pending bookings count
  const pendingBookings = await prisma.booking.count({
    where: {
      shift: { careHomeId: careHome.id },
      status: 'PENDING',
    },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {careHome.name}</h1>
          <p className="text-gray-600 mt-1">Manage your shifts and staff bookings</p>
        </div>
        <Link
          href="/dashboard/care-home/shifts/new"
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Post New Shift
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Open Shifts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{openShifts}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Requests</p>
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
              <p className="text-sm text-gray-500">Filled Shifts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{filledShifts}</p>
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
              <p className="text-2xl font-bold text-gray-900 mt-1">{completedShifts}</p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-teal-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Alert for pending bookings */}
      {pendingBookings > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800">
              You have {pendingBookings} pending booking request{pendingBookings > 1 ? 's' : ''}
            </p>
            <p className="text-sm text-amber-700 mt-1">
              Review and confirm staff applications to fill your shifts.
            </p>
            <Link
              href="/dashboard/care-home/bookings"
              className="text-sm font-semibold text-amber-800 hover:text-amber-900 mt-2 inline-block"
            >
              View Requests &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Upcoming Shifts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Shifts</h2>
            <Link
              href="/dashboard/care-home/shifts"
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              View All
            </Link>
          </div>
        </div>

        {careHome.shifts.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Shifts</h3>
            <p className="text-gray-500 mb-4">Post your first shift to start finding care staff</p>
            <Link
              href="/dashboard/care-home/shifts/new"
              className="inline-flex items-center px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Post a Shift
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {careHome.shifts.map((shift) => {
              const confirmedBooking = shift.bookings.find((b) => b.status === 'CONFIRMED')
              const pendingCount = shift.bookings.filter((b) => b.status === 'PENDING').length

              return (
                <div key={shift.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{shift.title}</h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            shift.status === 'OPEN'
                              ? 'bg-blue-100 text-blue-700'
                              : shift.status === 'FILLED'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {shift.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
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
                          {shift.hourlyRate.toString()}/hr
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {confirmedBooking ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <Users className="w-5 h-5" />
                          <span className="text-sm font-medium">
                            {confirmedBooking.careStaff.firstName} {confirmedBooking.careStaff.lastName}
                          </span>
                        </div>
                      ) : pendingCount > 0 ? (
                        <span className="text-sm text-amber-600 font-medium">
                          {pendingCount} applicant{pendingCount > 1 ? 's' : ''}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">No applicants yet</span>
                      )}

                      <Link
                        href={`/dashboard/care-home/shifts/${shift.id}`}
                        className="px-4 py-2 text-sm font-medium text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
