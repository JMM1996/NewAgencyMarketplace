'use client'

import { User, Star, Shield, CheckCircle, Award, Briefcase, Clock } from 'lucide-react'
import Image from 'next/image'
import type { CareStaff, Qualification, VerificationStatus } from '@/generated/prisma'

interface StaffProfileCardProps {
  staff: CareStaff & {
    qualifications?: Qualification[]
  }
  compact?: boolean
}

const staffTypeLabels: Record<string, string> = {
  REGISTERED_NURSE: 'Registered Nurse',
  HEALTHCARE_ASSISTANT: 'Healthcare Assistant',
  SUPPORT_WORKER: 'Support Worker',
  SENIOR_CARER: 'Senior Carer',
  CARE_ASSISTANT: 'Care Assistant',
  OTHER: 'Other',
}

// Helper to format name with surname initial for privacy
function formatPrivateName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName.charAt(0).toUpperCase()}.`
}

export function StaffProfileCard({ staff, compact = false }: StaffProfileCardProps) {
  const isVerified = staff.verificationStatus === 'VERIFIED'
  const hasDbsVerified = isVerified && staff.dbsCertificateNumber && staff.dbsIssueDate
  const hasRtwVerified = isVerified && staff.rightToWorkConfirmed
  const displayName = formatPrivateName(staff.firstName, staff.lastName)

  if (compact) {
    return (
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
          {staff.profilePhoto ? (
            <Image
              src={staff.profilePhoto}
              alt={displayName}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-6 h-6 text-teal-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900">
              {displayName}
            </p>
            {isVerified && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
          </div>
          <p className="text-sm text-gray-500">
            {staffTypeLabels[staff.staffType] || staff.staffType.replace(/_/g, ' ')}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
            {staff.yearsExperience > 0 && (
              <span className="flex items-center text-gray-600">
                <Briefcase className="w-4 h-4 mr-1 text-gray-400" />
                {staff.yearsExperience} {staff.yearsExperience === 1 ? 'year' : 'years'} exp.
              </span>
            )}
            {staff.averageRating && Number(staff.averageRating) > 0 && (
              <span className="flex items-center text-gray-600">
                <Star className="w-4 h-4 text-amber-400 fill-current mr-1" />
                {staff.averageRating.toString()}
              </span>
            )}
            {hasDbsVerified && (
              <span className="flex items-center text-green-600">
                <Shield className="w-4 h-4 mr-1" />
                DBS
              </span>
            )}
            {hasRtwVerified && (
              <span className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                RTW
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 border-b border-gray-100">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm overflow-hidden">
            {staff.profilePhoto ? (
              <Image
                src={staff.profilePhoto}
                alt={displayName}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-teal-600" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-gray-900">
                {displayName}
              </h3>
              {isVerified && (
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </span>
              )}
            </div>
            <p className="text-gray-600">
              {staffTypeLabels[staff.staffType] || staff.staffType.replace(/_/g, ' ')}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
            <Briefcase className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{staff.yearsExperience || 0}</p>
          <p className="text-xs text-gray-500">Years Exp.</p>
        </div>
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
            <Star className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {staff.averageRating ? staff.averageRating.toString() : '-'}
          </p>
          <p className="text-xs text-gray-500">Rating</p>
        </div>
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{staff.totalShiftsCompleted}</p>
          <p className="text-xs text-gray-500">Shifts</p>
        </div>
      </div>

      {/* Verification Badges */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-wrap gap-2">
          {hasDbsVerified ? (
            <span className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-full border border-green-200">
              <Shield className="w-4 h-4 mr-1.5" />
              DBS Verified
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-500 bg-gray-50 rounded-full border border-gray-200">
              <Shield className="w-4 h-4 mr-1.5" />
              DBS Pending
            </span>
          )}
          {hasRtwVerified ? (
            <span className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-full border border-green-200">
              <CheckCircle className="w-4 h-4 mr-1.5" />
              Right to Work
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-500 bg-gray-50 rounded-full border border-gray-200">
              <CheckCircle className="w-4 h-4 mr-1.5" />
              RTW Pending
            </span>
          )}
        </div>
      </div>

      {/* Bio */}
      {staff.bio && (
        <div className="p-4 border-b border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">About</h4>
          <p className="text-sm text-gray-600">{staff.bio}</p>
        </div>
      )}

      {/* Qualifications */}
      {staff.qualifications && staff.qualifications.length > 0 && (
        <div className="p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Award className="w-4 h-4" />
            Qualifications
          </h4>
          <div className="flex flex-wrap gap-2">
            {staff.qualifications.slice(0, 5).map((qual) => (
              <span
                key={qual.id}
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-teal-700 bg-teal-50 rounded-md"
              >
                {qual.name}
              </span>
            ))}
            {staff.qualifications.length > 5 && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-md">
                +{staff.qualifications.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
