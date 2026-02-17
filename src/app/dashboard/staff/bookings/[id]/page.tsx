import { redirect, notFound } from 'next/navigation'
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
  CheckCircle,
  XCircle,
  AlertCircle,
  Car,
  Shirt,
  Coffee,
  UtensilsCrossed,
  Phone,
} from 'lucide-react'
import { format } from 'date-fns'

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending Review' },
  CONFIRMED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Confirmed' },
  REJECTED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Not Selected' },
  CANCELLED: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Cancelled' },
  CANCELLED_BY_STAFF: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Cancelled' },
  COMPLETED: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Completed' },
}

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()

  if (!user || user.role !== 'CARE_STAFF') {
    redirect('/login')
  }

  const careStaff = await prisma.careStaff.findUnique({
    where: { userId: user.id },
  })

  if (!careStaff) {
    redirect('/login')
  }

  const booking = await prisma.booking.findUnique({
    where: { id, careStaffId: careStaff.id },
    include: {
      shift: {
        include: {
          careHome: true,
        },
      },
    },
  })

  if (!booking) {
    notFound()
  }

  const { shift } = booking

  // Calculate earnings
  const [startHour, startMin] = shift.startTime.split(':').map(Number)
  const [endHour, endMin] = shift.endTime.split(':').map(Number)
  let totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin)
  if (totalMinutes < 0) totalMinutes += 24 * 60

  // If paid break, include break time in paid hours
  const paidMinutes = shift.paidBreak ? totalMinutes : totalMinutes - shift.breakDuration
  const displayHours = Math.floor((totalMinutes - shift.breakDuration) / 60)
  const displayMins = (totalMinutes - shift.breakDuration) % 60

  const hourlyRate = Number(booking.agreedRate)
  const grossPay = (paidMinutes / 60) * hourlyRate
  const platformFee = grossPay * 0.15
  const netPay = grossPay - platformFee

  const status = statusStyles[booking.status] || statusStyles.PENDING

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/dashboard/staff"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Booking Status */}
          <div className={`rounded-xl p-6 ${
            booking.status === 'CONFIRMED' ? 'bg-green-50 border border-green-200' :
            booking.status === 'PENDING' ? 'bg-amber-50 border border-amber-200' :
            booking.status === 'REJECTED' ? 'bg-red-50 border border-red-200' :
            'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              {booking.status === 'CONFIRMED' && <CheckCircle className="w-6 h-6 text-green-600" />}
              {booking.status === 'PENDING' && <AlertCircle className="w-6 h-6 text-amber-600" />}
              {booking.status === 'REJECTED' && <XCircle className="w-6 h-6 text-red-600" />}
              <div>
                <h2 className={`text-lg font-semibold ${
                  booking.status === 'CONFIRMED' ? 'text-green-800' :
                  booking.status === 'PENDING' ? 'text-amber-800' :
                  'text-gray-800'
                }`}>
                  {status.label}
                </h2>
                <p className="text-sm text-gray-600">
                  {booking.status === 'CONFIRMED' && "You're booked for this shift. See care home contact details below."}
                  {booking.status === 'PENDING' && "Your application is being reviewed by the care home."}
                  {booking.status === 'REJECTED' && "Unfortunately, another applicant was selected for this shift."}
                </p>
              </div>
            </div>
          </div>

          {/* Shift Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{shift.title}</h1>
            <p className="text-gray-600 mb-6">{shift.requiredRole.replace(/_/g, ' ')}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
                  <p className="font-medium text-gray-900">£{hourlyRate}/hr</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="font-medium text-gray-900">
                    {displayHours}h {displayMins > 0 ? `${displayMins}m` : ''}
                  </p>
                </div>
              </div>
            </div>

            {shift.description && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600">{shift.description}</p>
              </div>
            )}

            {/* Amenities */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">What&apos;s Provided</h3>
              <div className="flex flex-wrap gap-3">
                {shift.parkingAvailable && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-700 text-sm">
                    <Car className="w-4 h-4" />
                    <span>Free Parking</span>
                  </div>
                )}
                {shift.uniformProvided && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-700 text-sm">
                    <Shirt className="w-4 h-4" />
                    <span>Uniform Provided</span>
                  </div>
                )}
                {shift.breakDuration > 0 && (
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    shift.paidBreak ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    <Coffee className="w-4 h-4" />
                    <span>{shift.breakDuration}min {shift.paidBreak ? 'Paid Break' : 'Break'}</span>
                  </div>
                )}
                {shift.mealsProvided && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-700 text-sm">
                    <UtensilsCrossed className="w-4 h-4" />
                    <span>Meals Provided</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Care Home Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Care Home</h3>
            <div className="flex items-start gap-4 mb-4">
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
                  {shift.careHome.careHomeType.replace(/_/g, ' ')}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>
                  {shift.careHome.addressLine1}, {shift.careHome.city}, {shift.careHome.postcode}
                </span>
              </div>

              {/* Show contact details only if confirmed */}
              {booking.status === 'CONFIRMED' && shift.careHome.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a href={`tel:${shift.careHome.phone}`} className="text-teal-600 hover:underline">
                    {shift.careHome.phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Earnings */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-6 text-white">
            <h3 className="text-sm font-medium text-teal-100 mb-1">Your Earnings</h3>
            <p className="text-3xl font-bold mb-4">£{netPay.toFixed(2)}</p>

            <div className="space-y-2 text-sm text-teal-100">
              <div className="flex justify-between">
                <span>Hourly Rate</span>
                <span>£{hourlyRate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Paid Hours</span>
                <span>{(paidMinutes / 60).toFixed(1)}hrs</span>
              </div>
              {shift.paidBreak && shift.breakDuration > 0 && (
                <div className="flex justify-between text-green-300">
                  <span>✓ Includes {shift.breakDuration}min paid break</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Gross Pay</span>
                <span>£{grossPay.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-teal-500 pt-2 mt-2">
                <span>Platform Fee (15%)</span>
                <span>-£{platformFee.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Application Note */}
          {booking.staffNotes && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Your Application Note</h3>
              <p className="text-gray-600 text-sm italic">&quot;{booking.staffNotes}&quot;</p>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Timeline</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span className="text-gray-600">
                  Applied {format(new Date(booking.appliedAt), 'd MMM yyyy, HH:mm')}
                </span>
              </div>
              {booking.status === 'CONFIRMED' && booking.confirmedAt && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">
                    Confirmed {format(new Date(booking.confirmedAt), 'd MMM yyyy, HH:mm')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
