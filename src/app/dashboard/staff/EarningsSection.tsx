'use client'

import { useState, useEffect } from 'react'
import { Banknote, Calendar, TrendingUp, Loader2 } from 'lucide-react'
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns'

interface Earning {
  id: string
  date: string
  shiftTitle: string
  careHomeName: string
  hoursWorked: number
  grossPay: number
  platformFee: number
  netPay: number
}

interface EarningsSummary {
  totalGross: number
  totalFees: number
  totalNet: number
  shiftCount: number
}

interface EarningsResponse {
  earnings: Earning[]
  summary: EarningsSummary
}

type DateFilter = 'this_month' | 'last_month' | 'last_3_months' | 'all_time' | 'custom'

export function EarningsSection() {
  const [dateFilter, setDateFilter] = useState<DateFilter>('this_month')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [data, setData] = useState<EarningsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getDateRange = (): { start: Date; end: Date } => {
    const now = new Date()
    switch (dateFilter) {
      case 'this_month':
        return { start: startOfMonth(now), end: endOfMonth(now) }
      case 'last_month':
        const lastMonth = subMonths(now, 1)
        return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) }
      case 'last_3_months':
        return { start: startOfMonth(subMonths(now, 2)), end: endOfMonth(now) }
      case 'all_time':
        return { start: new Date('2020-01-01'), end: now }
      case 'custom':
        return {
          start: customStartDate ? new Date(customStartDate) : startOfMonth(now),
          end: customEndDate ? new Date(customEndDate) : endOfMonth(now),
        }
      default:
        return { start: startOfMonth(now), end: endOfMonth(now) }
    }
  }

  useEffect(() => {
    const fetchEarnings = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const { start, end } = getDateRange()
        const params = new URLSearchParams({
          startDate: start.toISOString(),
          endDate: end.toISOString(),
        })

        const response = await fetch(`/api/staff/earnings?${params}`)
        if (!response.ok) {
          throw new Error('Failed to fetch earnings')
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setIsLoading(false)
      }
    }

    // Only fetch when not using custom dates, or when custom dates are both set
    if (dateFilter !== 'custom' || (customStartDate && customEndDate)) {
      fetchEarnings()
    }
  }, [dateFilter, customStartDate, customEndDate])

  const formatCurrency = (amount: number) => `£${amount.toFixed(2)}`

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-semibold text-gray-900">Earnings</h2>
          </div>

          {/* Date Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as DateFilter)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="last_3_months">Last 3 Months</option>
              <option value="all_time">All Time</option>
              <option value="custom">Custom Range</option>
            </select>

            {dateFilter === 'custom' && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 flex justify-center">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        </div>
      ) : error ? (
        <div className="p-6 text-center text-red-600">{error}</div>
      ) : data ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-gray-100">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Gross Earnings</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(data.summary.totalGross)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Platform Fees (15%)</p>
              <p className="text-xl font-bold text-red-600">-{formatCurrency(data.summary.totalFees)}</p>
            </div>
            <div className="bg-teal-50 rounded-lg p-4">
              <p className="text-sm text-teal-600 mb-1">Net Earnings</p>
              <p className="text-xl font-bold text-teal-700">{formatCurrency(data.summary.totalNet)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Shifts Completed</p>
              <p className="text-xl font-bold text-gray-900">{data.summary.shiftCount}</p>
            </div>
          </div>

          {/* Earnings List */}
          {data.earnings.length === 0 ? (
            <div className="p-12 text-center">
              <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No earnings found for this period</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {data.earnings.map((earning) => (
                <div key={earning.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <p className="font-medium text-gray-900">{earning.shiftTitle}</p>
                      <p className="text-sm text-gray-500">{earning.careHomeName}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(earning.date), 'EEE, d MMM yyyy')}</span>
                        <span>•</span>
                        <span>{earning.hoursWorked.toFixed(1)} hours</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-teal-600">{formatCurrency(earning.netPay)}</p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(earning.grossPay)} - {formatCurrency(earning.platformFee)} fee
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : null}
    </div>
  )
}
