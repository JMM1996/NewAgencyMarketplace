'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Shield,
  FileText,
  Upload,
  CheckCircle,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Clock,
  XCircle,
  Eye,
} from 'lucide-react'
import type { CareStaff, VerificationStatus } from '@/generated/prisma'

interface VerificationSectionProps {
  careStaff: CareStaff
}

const verificationStatusConfig: Record<VerificationStatus, {
  label: string
  color: string
  bgColor: string
  icon: React.ElementType
}> = {
  INCOMPLETE: {
    label: 'Incomplete',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: AlertTriangle,
  },
  PENDING_REVIEW: {
    label: 'Pending Review',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    icon: Clock,
  },
  VERIFIED: {
    label: 'Verified',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: CheckCircle,
  },
  REJECTED: {
    label: 'Needs Attention',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: XCircle,
  },
}

export function VerificationSection({ careStaff }: VerificationSectionProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    dbsCertificateNumber: careStaff.dbsCertificateNumber || '',
    dbsIssueDate: careStaff.dbsIssueDate
      ? new Date(careStaff.dbsIssueDate).toISOString().split('T')[0]
      : '',
    dbsOnUpdateService: careStaff.dbsOnUpdateService,
    rightToWorkConfirmed: careStaff.rightToWorkConfirmed,
  })

  const [dbsFile, setDbsFile] = useState<File | null>(null)
  const [rtwFile, setRtwFile] = useState<File | null>(null)

  const statusConfig = verificationStatusConfig[careStaff.verificationStatus]
  const StatusIcon = statusConfig.icon

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'dbs' | 'rtw') => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        setError('File must be a JPG, PNG, or PDF')
        return
      }
      setError(null)
      if (type === 'dbs') {
        setDbsFile(file)
      } else {
        setRtwFile(file)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Create FormData for file upload
      const submitData = new FormData()
      submitData.append('dbsCertificateNumber', formData.dbsCertificateNumber)
      submitData.append('dbsIssueDate', formData.dbsIssueDate)
      submitData.append('dbsOnUpdateService', formData.dbsOnUpdateService.toString())
      submitData.append('rightToWorkConfirmed', formData.rightToWorkConfirmed.toString())

      if (dbsFile) {
        submitData.append('dbsCertificate', dbsFile)
      }
      if (rtwFile) {
        submitData.append('rightToWorkDocument', rtwFile)
      }

      const response = await fetch('/api/staff/verification', {
        method: 'POST',
        body: submitData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update verification details')
      }

      setSuccess(true)
      setDbsFile(null)
      setRtwFile(null)
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  // Check if DBS is valid (less than 3 years old)
  const dbsIssueDate = careStaff.dbsIssueDate ? new Date(careStaff.dbsIssueDate) : null
  const isDbsExpired = dbsIssueDate && (new Date().getTime() - dbsIssueDate.getTime()) > (3 * 365 * 24 * 60 * 60 * 1000)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-semibold text-gray-900">Verification Documents</h2>
          </div>
          <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${statusConfig.bgColor} ${statusConfig.color}`}>
            <StatusIcon className="w-4 h-4 mr-1.5" />
            {statusConfig.label}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          These documents are required for verification and are kept private
        </p>
        <p className="text-sm text-teal-600 mt-1">
          We collate this data and display it simply to care homes
        </p>
      </div>

      {/* Verification Notes from Admin */}
      {careStaff.verificationNotes && careStaff.verificationStatus === 'REJECTED' && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-medium text-red-800 mb-1">Admin Feedback</p>
          <p className="text-sm text-red-700">{careStaff.verificationNotes}</p>
        </div>
      )}

      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-sm text-green-800">Verification details updated successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* DBS Certificate Section */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            DBS Certificate
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dbsCertificateNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Certificate Number *
              </label>
              <input
                type="text"
                id="dbsCertificateNumber"
                name="dbsCertificateNumber"
                value={formData.dbsCertificateNumber}
                onChange={handleChange}
                placeholder="001234567890"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="dbsIssueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Issue Date *
              </label>
              <input
                type="date"
                id="dbsIssueDate"
                name="dbsIssueDate"
                value={formData.dbsIssueDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              {isDbsExpired && (
                <p className="text-sm text-amber-600 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  DBS certificate is over 3 years old
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="dbsOnUpdateService"
                  checked={formData.dbsOnUpdateService}
                  onChange={handleChange}
                  className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700">
                  My DBS is registered on the Update Service
                </span>
              </label>
            </div>

            {!formData.dbsOnUpdateService && (
              <div className="md:col-span-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800 mb-2">
                  <strong>Enhanced DBS Required:</strong> If your DBS is not on the Update Service,
                  you may need to apply for a new Enhanced DBS check.
                </p>
                <Link
                  href="/dbs-application"
                  className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700"
                >
                  How can CareConnect help with your DBS?
                  <ExternalLink className="w-4 h-4 ml-1" />
                </Link>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload DBS Certificate Screenshot *
              </label>
              <div className="flex items-center gap-4">
                <label className="flex-1 relative cursor-pointer">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFileChange(e, 'dbs')}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 transition-colors">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {dbsFile ? dbsFile.name : 'Choose file or drag and drop'}
                    </span>
                  </div>
                </label>
                {careStaff.dbsCertificateUrl && !dbsFile && (
                  <a
                    href={careStaff.dbsCertificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700"
                  >
                    <Eye className="w-4 h-4" />
                    View Current
                  </a>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG or PDF, max 5MB</p>
            </div>
          </div>
        </div>

        {/* Right to Work Section */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-600" />
            Right to Work
          </h3>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="rightToWorkConfirmed"
                  checked={formData.rightToWorkConfirmed}
                  onChange={handleChange}
                  className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700">
                  I confirm I have the right to work in the UK
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Right to Work Document *
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Acceptable documents: UK/Irish Passport, Biometric Residence Permit, Share Code from gov.uk
              </p>
              <div className="flex items-center gap-4">
                <label className="flex-1 relative cursor-pointer">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFileChange(e, 'rtw')}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 transition-colors">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {rtwFile ? rtwFile.name : 'Choose file or drag and drop'}
                    </span>
                  </div>
                </label>
                {careStaff.rightToWorkDocumentUrl && !rtwFile && (
                  <a
                    href={careStaff.rightToWorkDocumentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700"
                  >
                    <Eye className="w-4 h-4" />
                    View Current
                  </a>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG or PDF, max 5MB</p>
            </div>
          </div>
        </div>

        {/* Submit Section */}
        <div className="p-6 bg-gray-50 rounded-b-xl">
          {careStaff.verificationStatus === 'PENDING_REVIEW' && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <p className="text-sm text-amber-800">
                Your verification is pending review. You can still update your documents.
              </p>
            </div>
          )}

          {careStaff.verificationStatus === 'VERIFIED' && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-800">
                Your profile is verified! Any changes will require re-verification.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              'Save & Submit for Verification'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
