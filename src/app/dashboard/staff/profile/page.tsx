import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ArrowLeft, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import { ProfileForm } from './ProfileForm'
import { QualificationsList } from './QualificationsList'
import { EmploymentHistoryList } from './EmploymentHistoryList'
import { VerificationSection } from './VerificationSection'

const verificationMessages = {
  INCOMPLETE: {
    type: 'warning',
    message: 'Complete your profile and submit verification documents to be visible to care homes.',
    icon: AlertTriangle,
  },
  PENDING_REVIEW: {
    type: 'info',
    message: 'Your profile is being reviewed by our team. We\'ll notify you once verification is complete.',
    icon: Clock,
  },
  VERIFIED: {
    type: 'success',
    message: 'Your profile is verified and visible to care homes.',
    icon: CheckCircle,
  },
  REJECTED: {
    type: 'error',
    message: 'Your verification was unsuccessful. Please review the feedback and resubmit.',
    icon: AlertTriangle,
  },
}

export default async function StaffProfilePage() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'CARE_STAFF') {
    redirect('/login')
  }

  const careStaff = await prisma.careStaff.findUnique({
    where: { userId: user.id },
    include: {
      qualifications: {
        orderBy: { createdAt: 'desc' },
      },
      employmentHistory: {
        orderBy: { startDate: 'desc' },
      },
    },
  })

  if (!careStaff) {
    redirect('/login')
  }

  const statusConfig = verificationMessages[careStaff.verificationStatus]
  const StatusIcon = statusConfig.icon

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/dashboard/staff"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
        <p className="text-gray-600 mt-1">
          Keep your profile up to date to increase your chances of getting booked
        </p>
      </div>

      {/* Verification Status Banner */}
      <div className={`mb-8 p-4 rounded-lg flex items-start gap-3 ${
        statusConfig.type === 'success' ? 'bg-green-50 border border-green-200' :
        statusConfig.type === 'warning' ? 'bg-amber-50 border border-amber-200' :
        statusConfig.type === 'error' ? 'bg-red-50 border border-red-200' :
        'bg-blue-50 border border-blue-200'
      }`}>
        <StatusIcon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
          statusConfig.type === 'success' ? 'text-green-600' :
          statusConfig.type === 'warning' ? 'text-amber-600' :
          statusConfig.type === 'error' ? 'text-red-600' :
          'text-blue-600'
        }`} />
        <p className={`text-sm ${
          statusConfig.type === 'success' ? 'text-green-800' :
          statusConfig.type === 'warning' ? 'text-amber-800' :
          statusConfig.type === 'error' ? 'text-red-800' :
          'text-blue-800'
        }`}>
          {statusConfig.message}
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile Form */}
        <ProfileForm careStaff={careStaff} />

        {/* Employment History Section */}
        <EmploymentHistoryList employmentHistory={careStaff.employmentHistory} />

        {/* Qualifications Section */}
        <QualificationsList
          qualifications={careStaff.qualifications}
          careStaffId={careStaff.id}
        />

        {/* Verification Documents Section */}
        <VerificationSection careStaff={careStaff} />
      </div>
    </div>
  )
}
