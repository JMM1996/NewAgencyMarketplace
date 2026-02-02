import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ArrowLeft } from 'lucide-react'
import { ProfileForm } from './ProfileForm'
import { QualificationsList } from './QualificationsList'

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
    },
  })

  if (!careStaff) {
    redirect('/login')
  }

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

      <div className="space-y-8">
        {/* Profile Form */}
        <ProfileForm careStaff={careStaff} />

        {/* Qualifications Section */}
        <QualificationsList
          qualifications={careStaff.qualifications}
          careStaffId={careStaff.id}
        />
      </div>
    </div>
  )
}
