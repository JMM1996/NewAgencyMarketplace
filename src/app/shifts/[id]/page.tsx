import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Banknote,
  Building2,
  Star,
  CheckCircle,
  Shield,
  Car,
  Shirt,
  Info,
} from 'lucide-react'
import { format } from 'date-fns'
import { StaffType, ShiftType } from '@/generated/prisma'
import { ApplyButton } from './ApplyButton'

const staffTypeLabels: Record<StaffType, string> = {
  REGISTERED_NURSE: 'Registered Nurse',
  HEALTHCARE_ASSISTANT: 'Healthcare Assistant',
  SUPPORT_WORKER: 'Support Worker',
  SENIOR_CARER: 'Senior Carer',
  CARE_ASSISTANT: 'Care Assistant',
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

const careHomeTypeLabels: Record<string, string> = {
  RESIDENTIAL: 'Residential Care',
  NURSING: 'Nursing Home',
  DEMENTIA: 'Dementia Care',
  LEARNING_DISABILITIES: 'Learning Disabilities',
  MENTAL_HEALTH: 'Mental Health',
  REHABILITATION: 'Rehabilitation',
  RESPITE: 'Respite Care',
  OTHER: 'Other',
}

export default async function ShiftDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()

  const shift = await prisma.shift.findUnique({
    where: { id },
    include: {
      careHome: true,
      bookings: user?.role === 'CARE_STAFF'
        ? {
            where: {
              careStaff: {
                userId: user.id,
              },
            },
          }
        : false,
    },
  })

  if (!shift) {
    notFound()
  }

  const userBooking = shift.bookings?.[0]
  const hasApplied = !!userBooking

  // Calculate shift duration
  const [startHour, startMin] = shift.startTime.split(':').map(Number)
  const [endHour, endMin] = shift.endTime.split(':').map(Number)
  let totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin)
  if (totalMinutes < 0) totalMinutes += 24 * 60
  const workingMinutes = totalMinutes - shift.breakDuration
  const hours = Math.floor(workingMinutes / 60)
  const mins = workingMinutes % 60

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/shifts"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shifts
        </Link>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Shift Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-teal-100 text-teal-700">
                      {shiftTypeLabels[shift.shiftType]}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      shift.status === 'OPEN'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {shift.status === 'OPEN' ? 'Available' : shift.status}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">{shift.title}</h1>
                  <p className="text-gray-600 mt-1">{staffTypeLabels[shift.requiredRole]}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(shift.date), 'd MMM yyyy')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="font-medium text-gray-900">
                      {shift.startTime} - {shift.endTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Banknote className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Pay Rate</p>
                    <p className="font-medium text-gray-900">£{shift.hourlyRate.toString()}/hr</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-medium text-gray-900">
                      {hours}h {mins > 0 ? `${mins}m` : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {shift.description && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Shift Description</h2>
                <p className="text-gray-600 whitespace-pre-line">{shift.description}</p>
              </div>
            )}

            {/* Requirements */}
            {shift.specialRequirements && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Special Requirements</h2>
                <p className="text-gray-600 whitespace-pre-line">{shift.specialRequirements}</p>
              </div>
            )}

            {/* Amenities */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">What&apos;s Provided</h2>
              <div className="flex flex-wrap gap-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  shift.parkingAvailable ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'
                }`}>
                  <Car className="w-5 h-5" />
                  <span className="font-medium">Parking {shift.parkingAvailable ? 'Available' : 'Not Available'}</span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  shift.uniformProvided ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'
                }`}>
                  <Shirt className="w-5 h-5" />
                  <span className="font-medium">Uniform {shift.uniformProvided ? 'Provided' : 'Required'}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700">
                  <Info className="w-5 h-5" />
                  <span className="font-medium">{shift.breakDuration}min Break</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pay Summary */}
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-6 text-white">
              <h3 className="text-sm font-medium text-teal-100 mb-1">Estimated Earnings</h3>
              {(() => {
                const grossPay = shift.totalPay ? Number(shift.totalPay) : (workingMinutes / 60 * Number(shift.hourlyRate));
                const platformFee = grossPay * 0.15;
                const netPay = grossPay - platformFee;
                return (
                  <>
                    <p className="text-3xl font-bold mb-4">
                      £{netPay.toFixed(2)}
                    </p>
                    <div className="space-y-2 text-sm text-teal-100">
                      <div className="flex justify-between">
                        <span>Hourly Rate</span>
                        <span>£{shift.hourlyRate.toString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Working Hours</span>
                        <span>{(workingMinutes / 60).toFixed(1)}hrs</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gross Pay</span>
                        <span>£{grossPay.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t border-teal-500 pt-2 mt-2">
                        <span>Platform Fee (15%)</span>
                        <span>-£{platformFee.toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Care Home Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Care Home</h3>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{shift.careHome.name}</h4>
                    {shift.careHome.verified && (
                      <CheckCircle className="w-4 h-4 text-teal-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {careHomeTypeLabels[shift.careHome.careHomeType]}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>
                    {shift.careHome.addressLine1}, {shift.careHome.city}, {shift.careHome.postcode}
                  </span>
                </div>

                {shift.careHome.averageRating && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span>{shift.careHome.averageRating.toString()} rating</span>
                  </div>
                )}

                {shift.careHome.cqcRating && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span>CQC: {shift.careHome.cqcRating}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Apply Button */}
            <ApplyButton
              shiftId={shift.id}
              isLoggedIn={!!user}
              isCareStaff={user?.role === 'CARE_STAFF'}
              hasApplied={hasApplied}
              bookingStatus={userBooking?.status}
              shiftStatus={shift.status}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
