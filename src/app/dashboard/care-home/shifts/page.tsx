import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Banknote,
  Plus,
  Users,
  CheckCircle,
} from 'lucide-react'
import { format } from 'date-fns'

export default async function CareHomeShiftsPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'CARE_HOME') {
    redirect('/login')
  }

  const careHome = await prisma.careHome.findUnique({
    where: { userId: user.id },
    include: {
      shifts: {
        include: {
          bookings: {
            include: {
              careStaff: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
        orderBy: { date: 'asc' },
      },
    },
  })

  if (!careHome) {
    redirect('/onboarding/care-home')
  }

  const upcomingShifts = careHome.shifts.filter(s => new Date(s.date) >= new Date())
  const pastShifts = careHome.shifts.filter(s => new Date(s.date) < new Date())

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/dashboard/care-home"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Shifts</h1>
          <p className="text-gray-600 mt-1">Manage your posted shifts</p>
        </div>
        <Link
          href="/dashboard/care-home/shifts/new"
          className="inline-flex items-center px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Post Shift
        </Link>
      </div>

      {/* Upcoming Shifts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Upcoming Shifts ({upcomingShifts.length})
          </h2>
        </div>

        {upcomingShifts.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Shifts</h3>
            <p className="text-gray-500">Post a shift to start finding care staff</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {upcomingShifts.map((shift) => {
              const confirmedBooking = shift.bookings.find((b) => b.status === 'CONFIRMED')
              const pendingCount = shift.bookings.filter((b) => b.status === 'PENDING').length

              return (
                <Link
                  key={shift.id}
                  href={`/dashboard/care-home/shifts/${shift.id}`}
                  className="block p-6 hover:bg-gray-50 transition-colors"
                >
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
                          £{shift.hourlyRate.toString()}/hr
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {confirmedBooking ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">
                            {confirmedBooking.careStaff.firstName} {confirmedBooking.careStaff.lastName}
                          </span>
                        </div>
                      ) : pendingCount > 0 ? (
                        <div className="flex items-center gap-2 text-amber-600">
                          <Users className="w-5 h-5" />
                          <span className="text-sm font-medium">
                            {pendingCount} applicant{pendingCount > 1 ? 's' : ''}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No applicants</span>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Past Shifts */}
      {pastShifts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-500">
              Past Shifts ({pastShifts.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {pastShifts.map((shift) => (
              <Link
                key={shift.id}
                href={`/dashboard/care-home/shifts/${shift.id}`}
                className="block p-6 hover:bg-gray-50 transition-colors opacity-60"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-700">{shift.title}</h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(shift.date), 'EEE, d MMM yyyy')} • {shift.startTime} - {shift.endTime}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                    {shift.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
