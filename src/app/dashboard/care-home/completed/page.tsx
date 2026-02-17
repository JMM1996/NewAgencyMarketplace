'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Banknote,
  CheckCircle,
  Users,
  Filter,
  Download,
} from 'lucide-react'
import { format, startOfMonth, endOfMonth, subMonths, parseISO } from 'date-fns'

type CompletedShift = {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  hourlyRate: number | { toString(): string }
  totalPay: number | { toString(): string }
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

export default function CompletedShiftsPage() {
  const [shifts, setShifts] = useState<CompletedShift[]>([])
  const [loading, setLoading] = useState(true)
  const [dateFrom, setDateFrom] = useState(() => {
    const d = startOfMonth(new Date())
    return format(d, 'yyyy-MM-dd')
  })
  const [dateTo, setDateTo] = useState(() => {
    const d = endOfMonth(new Date())
    return format(d, 'yyyy-MM-dd')
  })

  const quickFilters = [
    { label: 'This Month', from: startOfMonth(new Date()), to: endOfMonth(new Date()) },
    { label: 'Last Month', from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1)) },
    { label: 'Last 3 Months', from: startOfMonth(subMonths(new Date(), 2)), to: endOfMonth(new Date()) },
  ]

  useEffect(() => {
    async function fetchCompletedShifts() {
      setLoading(true)
      try {
        const res = await fetch(`/api/care-home/completed?from=${dateFrom}&to=${dateTo}`)
        if (res.ok) {
          const data = await res.json()
          setShifts(data.shifts || [])
        }
      } catch (error) {
        console.error('Failed to fetch completed shifts:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCompletedShifts()
  }, [dateFrom, dateTo])

  const totalSpend = shifts.reduce((sum, shift) => {
    return sum + Number(shift.totalPay || 0)
  }, 0)

  const applyQuickFilter = (from: Date, to: Date) => {
    setDateFrom(format(from, 'yyyy-MM-dd'))
    setDateTo(format(to, 'yyyy-MM-dd'))
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/dashboard/care-home"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Completed Shifts</h1>
        <p className="text-gray-600 mt-1">Review completed shifts for finance and reporting</p>
      </div>

      {/* Date Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h2 className="font-semibold text-gray-900">Filter by Date</h2>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quickFilters.map((filter) => (
            <button
              key={filter.label}
              onClick={() => applyQuickFilter(filter.from, filter.to)}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Date Range Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-teal-100 text-sm">Total Spend ({shifts.length} shifts)</p>
            <p className="text-3xl font-bold mt-1">£{totalSpend.toFixed(2)}</p>
            <p className="text-teal-200 text-sm mt-1">
              {dateFrom && dateTo
                ? `${format(parseISO(dateFrom), 'd MMM yyyy')} - ${format(parseISO(dateTo), 'd MMM yyyy')}`
                : 'All time'}
            </p>
          </div>
          <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Shifts List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Completed Shifts
            <span className="text-gray-400 font-normal ml-2">({shifts.length})</span>
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Loading shifts...</p>
          </div>
        ) : shifts.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Completed Shifts</h3>
            <p className="text-gray-500">
              No shifts were completed in the selected date range.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {shifts.map((shift) => {
              const completedBooking = shift.bookings.find(b => b.status === 'COMPLETED')

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
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                          COMPLETED
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

                    <div className="flex items-center gap-6">
                      {completedBooking && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="w-5 h-5" />
                          <span className="text-sm font-medium">
                            {completedBooking.careStaff.firstName} {completedBooking.careStaff.lastName}
                          </span>
                        </div>
                      )}
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-lg font-semibold text-gray-900">
                          £{Number(shift.totalPay || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
