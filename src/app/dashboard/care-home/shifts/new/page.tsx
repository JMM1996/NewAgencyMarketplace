'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Banknote,
  Users,
  AlertCircle,
  Loader2,
  CheckCircle,
  Info,
  Car,
  UtensilsCrossed,
  Shirt,
  Coffee,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'

const staffTypes = [
  { value: 'CARE_ASSISTANT', label: 'Care Assistant', minRate: 14, maxRate: 18 },
  { value: 'SENIOR_CARER', label: 'Senior Care Assistant', minRate: 16, maxRate: 22 },
  { value: 'REGISTERED_NURSE', label: 'Registered Nurse', minRate: 25, maxRate: 35 },
]

// Calendar Component with Time Selection
function MultiDateCalendar({
  selectedDates,
  onToggleDate,
  onClearAll,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
}: {
  selectedDates: Date[]
  onToggleDate: (date: Date) => void
  onClearAll: () => void
  startTime: string
  endTime: string
  onStartTimeChange: (time: string) => void
  onEndTimeChange: (time: string) => void
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate()

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay()

  // Adjust for Monday start (0 = Monday, 6 = Sunday)
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

  const monthName = currentMonth.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })

  const isDateSelected = (date: Date) => {
    return selectedDates.some(
      (d) => d.toDateString() === date.toDateString()
    )
  }

  const isDateInPast = (date: Date) => {
    return date < today
  }

  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const canGoPrev = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1) > today

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goToPrevMonth}
          disabled={!canGoPrev}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="font-semibold text-gray-900">{monthName}</h3>
        <button
          type="button"
          onClick={goToNextMonth}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before the 1st */}
        {Array.from({ length: adjustedFirstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1)
          const isPast = isDateInPast(date)
          const isSelected = isDateSelected(date)
          const isToday = date.toDateString() === today.toDateString()

          return (
            <button
              key={i}
              type="button"
              disabled={isPast}
              onClick={() => !isPast && onToggleDate(date)}
              className={`
                aspect-square rounded-lg text-sm font-medium transition-all
                flex items-center justify-center
                ${isPast
                  ? 'text-gray-300 cursor-not-allowed'
                  : isSelected
                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }
                ${isToday && !isSelected ? 'ring-2 ring-teal-500 ring-offset-1' : ''}
              `}
            >
              {i + 1}
            </button>
          )
        })}
      </div>

      {/* Selected dates summary */}
      {selectedDates.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {selectedDates.length} date{selectedDates.length > 1 ? 's' : ''} selected
            </span>
            <button
              type="button"
              onClick={onClearAll}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedDates
              .sort((a, b) => a.getTime() - b.getTime())
              .map((date, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-teal-50 text-teal-700 text-sm rounded border border-teal-200"
                >
                  {date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                  <button
                    type="button"
                    onClick={() => onToggleDate(date)}
                    className="hover:text-teal-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Time Selection */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Start Time
            </label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => onStartTimeChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time
            </label>
            <input
              type="time"
              required
              value={endTime}
              onChange={(e) => onEndTimeChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NewShiftPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [createdCount, setCreatedCount] = useState(0)

  const [selectedDates, setSelectedDates] = useState<Date[]>([])

  const [formData, setFormData] = useState({
    description: '',
    requiredRole: 'CARE_ASSISTANT',
    startTime: '07:00',
    endTime: '19:00',
    breakDuration: 30,
    hourlyRate: '',
    uniformProvided: false,
    parkingAvailable: true,
    paidBreak: false,
    mealsProvided: false,
    otherAmenities: '',
  })

  const selectedStaffType = useMemo(() => {
    return staffTypes.find(t => t.value === formData.requiredRole) || staffTypes[0]
  }, [formData.requiredRole])

  const toggleDate = (date: Date) => {
    setSelectedDates(prev => {
      const exists = prev.some(d => d.toDateString() === date.toDateString())
      if (exists) {
        return prev.filter(d => d.toDateString() !== date.toDateString())
      } else {
        return [...prev, date]
      }
    })
  }

  const clearAllDates = () => {
    setSelectedDates([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const dates = selectedDates.map(d => d.toISOString().split('T')[0])

      if (dates.length === 0) {
        throw new Error('Please select at least one date')
      }

      const res = await fetch('/api/shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          hourlyRate: parseFloat(formData.hourlyRate),
          dates,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create shift')
      }

      setCreatedCount(data.count || 1)
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard/care-home')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create shift')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {createdCount > 1 ? `${createdCount} Shifts Posted!` : 'Shift Posted!'}
          </h2>
          <p className="text-gray-600 mb-4">
            {createdCount > 1
              ? 'Your shifts have been published and care staff can now apply.'
              : 'Your shift has been published and care staff can now apply.'}
          </p>
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-teal-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/dashboard/care-home"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Post a New Shift</h1>
        <p className="text-gray-600 mb-8">Fill in the details to find qualified care staff</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Calendar Date & Time Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Select Date(s) & Time *
            </label>
            <MultiDateCalendar
              selectedDates={selectedDates}
              onToggleDate={toggleDate}
              onClearAll={clearAllDates}
              startTime={formData.startTime}
              endTime={formData.endTime}
              onStartTimeChange={(time) => setFormData({ ...formData, startTime: time })}
              onEndTimeChange={(time) => setFormData({ ...formData, endTime: time })}
            />
          </div>

          {/* Role Required */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Role Required *
            </label>
            <select
              required
              value={formData.requiredRole}
              onChange={(e) => setFormData({ ...formData, requiredRole: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            >
              {staffTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Hourly Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Banknote className="w-4 h-4 inline mr-1" />
              Hourly Rate (£) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">£</span>
              <input
                type="number"
                required
                min="1"
                step="0.50"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>
            {/* Suggested Rate */}
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <p className="text-sm text-blue-800 font-medium">
                  Suggested: £{selectedStaffType.minRate} - £{selectedStaffType.maxRate}/hr
                </p>
              </div>
            </div>
          </div>

          {/* Break Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Break Duration (minutes)
            </label>
            <select
              value={formData.breakDuration}
              onChange={(e) => setFormData({ ...formData, breakDuration: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            >
              <option value={0}>No break</option>
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shift Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the duties, unit/ward, and any other relevant details..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Shift Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                formData.uniformProvided ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="checkbox"
                  checked={formData.uniformProvided}
                  onChange={(e) => setFormData({ ...formData, uniformProvided: e.target.checked })}
                  className="sr-only"
                />
                <Shirt className={`w-5 h-5 ${formData.uniformProvided ? 'text-teal-600' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${formData.uniformProvided ? 'text-teal-700' : 'text-gray-700'}`}>
                  Uniform Provided
                </span>
              </label>

              <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                formData.parkingAvailable ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="checkbox"
                  checked={formData.parkingAvailable}
                  onChange={(e) => setFormData({ ...formData, parkingAvailable: e.target.checked })}
                  className="sr-only"
                />
                <Car className={`w-5 h-5 ${formData.parkingAvailable ? 'text-teal-600' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${formData.parkingAvailable ? 'text-teal-700' : 'text-gray-700'}`}>
                  Free Parking
                </span>
              </label>

              <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                formData.paidBreak ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="checkbox"
                  checked={formData.paidBreak}
                  onChange={(e) => setFormData({ ...formData, paidBreak: e.target.checked })}
                  className="sr-only"
                />
                <Coffee className={`w-5 h-5 ${formData.paidBreak ? 'text-teal-600' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${formData.paidBreak ? 'text-teal-700' : 'text-gray-700'}`}>
                  Paid Break
                </span>
              </label>

              <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                formData.mealsProvided ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="checkbox"
                  checked={formData.mealsProvided}
                  onChange={(e) => setFormData({ ...formData, mealsProvided: e.target.checked })}
                  className="sr-only"
                />
                <UtensilsCrossed className={`w-5 h-5 ${formData.mealsProvided ? 'text-teal-600' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${formData.mealsProvided ? 'text-teal-700' : 'text-gray-700'}`}>
                  Meals Provided
                </span>
              </label>
            </div>

            {/* Other Amenities */}
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Other (optional)
              </label>
              <input
                type="text"
                value={formData.otherAmenities}
                onChange={(e) => setFormData({ ...formData, otherAmenities: e.target.value })}
                placeholder="e.g., Tea & coffee available, Wi-Fi access..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <Link
              href="/dashboard/care-home"
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading || selectedDates.length === 0}
              className="flex-1 px-4 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Posting...
                </>
              ) : selectedDates.length > 1 ? (
                `Post ${selectedDates.length} Shifts`
              ) : (
                'Post Shift'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
