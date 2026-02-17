'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Plus,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Banknote,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns'

type Shift = {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  hourlyRate: number | { toString(): string }
  status: string
  bookings: {
    id: string
    status: string
    careStaff: {
      firstName: string
      lastName: string
    }
  }[]
}

type FilterType = 'all' | 'open' | 'pending' | 'filled'

export default function CareHomeDashboard() {
  const [careHome, setCareHome] = useState<{ name: string; shifts: Shift[] } | null>(null)
  const [allShifts, setAllShifts] = useState<Shift[]>([])
  const [stats, setStats] = useState({ open: 0, pending: 0, filled: 0, completed: 0 })
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/care-home/dashboard')
        if (res.ok) {
          const data = await res.json()
          setCareHome(data.careHome)
          setAllShifts(data.allShifts || [])
          setStats(data.stats)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Filter out completed shifts from main dashboard - they have their own page
  const activeShifts = allShifts.filter(shift => shift.status !== 'COMPLETED')

  const filteredShifts = activeShifts.filter(shift => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'open') return shift.status === 'OPEN'
    if (activeFilter === 'filled') return shift.status === 'FILLED'
    if (activeFilter === 'pending') {
      return shift.bookings.some(b => b.status === 'PENDING')
    }
    return true
  })

  // Calendar helpers
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startDayOfWeek = monthStart.getDay()
  const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1

  const getShiftsForDate = (date: Date) => {
    return filteredShifts.filter(shift => isSameDay(new Date(shift.date), date))
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!careHome) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p>Please complete your care home profile.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {careHome.name}</h1>
          <p className="text-gray-600 mt-1">Manage your shifts and staff bookings</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <CalendarDays className="w-5 h-5 mr-2" />
            {viewMode === 'list' ? 'Calendar View' : 'List View'}
          </button>
          <Link
            href="/dashboard/care-home/shifts/new"
            className="inline-flex items-center px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Post New Shift
          </Link>
        </div>
      </div>

      {/* Stats Grid - Interactive Filters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => setActiveFilter(activeFilter === 'open' ? 'all' : 'open')}
          className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all text-left ${
            activeFilter === 'open' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-100 hover:border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Open Shifts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.open}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              activeFilter === 'open' ? 'bg-blue-500' : 'bg-blue-100'
            }`}>
              <Calendar className={`w-6 h-6 ${activeFilter === 'open' ? 'text-white' : 'text-blue-600'}`} />
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveFilter(activeFilter === 'pending' ? 'all' : 'pending')}
          className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all text-left ${
            activeFilter === 'pending' ? 'border-amber-500 ring-2 ring-amber-100' : 'border-gray-100 hover:border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pending}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              activeFilter === 'pending' ? 'bg-amber-500' : 'bg-amber-100'
            }`}>
              <Clock className={`w-6 h-6 ${activeFilter === 'pending' ? 'text-white' : 'text-amber-600'}`} />
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveFilter(activeFilter === 'filled' ? 'all' : 'filled')}
          className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all text-left ${
            activeFilter === 'filled' ? 'border-green-500 ring-2 ring-green-100' : 'border-gray-100 hover:border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Filled Shifts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.filled}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              activeFilter === 'filled' ? 'bg-green-500' : 'bg-green-100'
            }`}>
              <CheckCircle className={`w-6 h-6 ${activeFilter === 'filled' ? 'text-white' : 'text-green-600'}`} />
            </div>
          </div>
        </button>

        <Link
          href="/dashboard/care-home/completed"
          className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-100 hover:border-teal-200 transition-all text-left block"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-teal-100">
              <TrendingUp className="w-6 h-6 text-teal-600" />
            </div>
          </div>
        </Link>
      </div>

      {/* Active Filter Indicator */}
      {activeFilter !== 'all' && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Showing: <span className="font-medium capitalize">{activeFilter}</span> shifts
          </span>
          <button
            onClick={() => setActiveFilter('all')}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Alert for pending bookings */}
      {stats.pending > 0 && activeFilter === 'all' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800">
              You have {stats.pending} pending booking request{stats.pending > 1 ? 's' : ''}
            </p>
            <p className="text-sm text-amber-700 mt-1">
              Review and confirm staff applications to fill your shifts.
            </p>
            <button
              onClick={() => setActiveFilter('pending')}
              className="text-sm font-semibold text-amber-800 hover:text-amber-900 mt-2 inline-block"
            >
              View Requests &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before the 1st */}
            {Array.from({ length: adjustedStartDay }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[100px] bg-gray-50 rounded-lg" />
            ))}

            {/* Day cells */}
            {daysInMonth.map(date => {
              const shiftsOnDay = getShiftsForDate(date)
              const hasShifts = shiftsOnDay.length > 0

              return (
                <div
                  key={date.toISOString()}
                  className={`min-h-[100px] p-2 rounded-lg border ${
                    isToday(date) ? 'border-teal-500 bg-teal-50' : 'border-gray-100'
                  } ${!isSameMonth(date, currentMonth) ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday(date) ? 'text-teal-600' : 'text-gray-700'
                  }`}>
                    {format(date, 'd')}
                  </div>
                  {hasShifts && (
                    <div className="space-y-1">
                      {shiftsOnDay.slice(0, 2).map(shift => {
                        const confirmedBooking = shift.bookings.find(b => b.status === 'CONFIRMED')
                        return (
                          <Link
                            key={shift.id}
                            href={`/dashboard/care-home/shifts/${shift.id}`}
                            className={`block text-xs p-1 rounded truncate ${
                              shift.status === 'FILLED'
                                ? 'bg-green-100 text-green-700'
                                : shift.status === 'OPEN'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {shift.startTime} {confirmedBooking ? '✓' : ''}
                          </Link>
                        )
                      })}
                      {shiftsOnDay.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{shiftsOnDay.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {activeFilter === 'all' ? 'All Shifts' : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Shifts`}
                <span className="text-gray-400 font-normal ml-2">({filteredShifts.length})</span>
              </h2>
              <Link
                href="/dashboard/care-home/shifts"
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                View All
              </Link>
            </div>
          </div>

          {filteredShifts.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Shifts Found</h3>
              <p className="text-gray-500 mb-4">
                {activeFilter === 'all'
                  ? 'Post your first shift to start finding care staff'
                  : `No ${activeFilter} shifts at the moment`}
              </p>
              {activeFilter === 'all' && (
                <Link
                  href="/dashboard/care-home/shifts/new"
                  className="inline-flex items-center px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Post a Shift
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredShifts.slice(0, 10).map((shift) => {
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
                          {pendingCount > 0 && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                              {pendingCount} pending
                            </span>
                          )}
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
                            <Users className="w-5 h-5" />
                            <span className="text-sm font-medium">
                              {confirmedBooking.careStaff.firstName} {confirmedBooking.careStaff.lastName.charAt(0)}.
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
      )}
    </div>
  )
}
