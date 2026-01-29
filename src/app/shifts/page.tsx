import { prisma } from '@/lib/db'
import Link from 'next/link'
import {
  Search,
  MapPin,
  Clock,
  Calendar,
  Banknote,
  Building2,
  Star,
  CheckCircle,
  Filter,
} from 'lucide-react'
import { format } from 'date-fns'
import { StaffType, ShiftType } from '@/generated/prisma'

const staffTypeLabels: Record<StaffType, string> = {
  REGISTERED_NURSE: 'Registered Nurse',
  HEALTHCARE_ASSISTANT: 'Healthcare Assistant',
  SUPPORT_WORKER: 'Support Worker',
  SENIOR_CARER: 'Senior Carer',
  CARE_ASSISTANT: 'Care Assistant',
  ACTIVITIES_COORDINATOR: 'Activities Coordinator',
  DOMESTIC_STAFF: 'Domestic Staff',
  KITCHEN_STAFF: 'Kitchen Staff',
  OTHER: 'Other',
}

const shiftTypeLabels: Record<ShiftType, string> = {
  DAY: 'Day Shift',
  NIGHT: 'Night Shift',
  LONG_DAY: 'Long Day',
  TWILIGHT: 'Twilight',
  SLEEP_IN: 'Sleep-in',
  WAKING_NIGHT: 'Waking Night',
}

interface SearchParams {
  location?: string
  role?: StaffType
  shiftType?: ShiftType
  page?: string
}

export default async function ShiftsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const limit = 12

  const where: Record<string, unknown> = {
    status: 'OPEN',
    date: { gte: new Date() },
  }

  if (params.location) {
    where.careHome = {
      OR: [
        { city: { contains: params.location, mode: 'insensitive' } },
        { postcode: { startsWith: params.location.toUpperCase() } },
      ],
    }
  }

  if (params.role) {
    where.requiredRole = params.role
  }

  if (params.shiftType) {
    where.shiftType = params.shiftType
  }

  const [shifts, total] = await Promise.all([
    prisma.shift.findMany({
      where,
      include: {
        careHome: {
          select: {
            id: true,
            name: true,
            city: true,
            postcode: true,
            careHomeType: true,
            averageRating: true,
            verified: true,
          },
        },
        _count: {
          select: { bookings: { where: { status: 'PENDING' } } },
        },
      },
      orderBy: { date: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.shift.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Care Shifts</h1>
          <p className="text-gray-600">Browse available shifts from verified care homes across the UK</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <form className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  defaultValue={params.location}
                  placeholder="City or postcode"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                name="role"
                defaultValue={params.role || ''}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              >
                <option value="">All Roles</option>
                {Object.entries(staffTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shift Type</label>
              <select
                name="shiftType"
                defaultValue={params.shiftType || ''}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              >
                <option value="">All Types</option>
                {Object.entries(shiftTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full px-4 py-2.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </button>
            </div>
          </div>
        </form>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{total}</span> shifts available
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Filter className="w-4 h-4" />
            Sorted by date
          </div>
        </div>

        {shifts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No shifts found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search filters or check back later for new opportunities.
            </p>
            <Link
              href="/shifts"
              className="text-teal-600 font-semibold hover:text-teal-700"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shifts.map((shift) => (
                <Link
                  key={shift.id}
                  href={`/shifts/${shift.id}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-teal-200 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                        {shift.title}
                      </h3>
                      <p className="text-sm text-gray-500">{staffTypeLabels[shift.requiredRole]}</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-teal-100 text-teal-700">
                      {shiftTypeLabels[shift.shiftType]}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{shift.careHome.name}</span>
                    {shift.careHome.verified && (
                      <CheckCircle className="w-4 h-4 text-teal-500" />
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(new Date(shift.date), 'EEE, d MMM yyyy')}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      {shift.startTime} - {shift.endTime}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      {shift.careHome.city}, {shift.careHome.postcode}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <Banknote className="w-5 h-5 text-teal-600" />
                      <span className="text-lg font-bold text-teal-600">
                        {shift.hourlyRate.toString()}
                      </span>
                      <span className="text-sm text-gray-500">/hr</span>
                    </div>
                    {shift.careHome.averageRating && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Star className="w-4 h-4 text-amber-400 fill-current" />
                        {shift.careHome.averageRating.toString()}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                {page > 1 && (
                  <Link
                    href={{
                      pathname: '/shifts',
                      query: { ...params, page: page - 1 },
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </Link>
                )}
                <span className="px-4 py-2 text-gray-600">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={{
                      pathname: '/shifts',
                      query: { ...params, page: page + 1 },
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
