'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Briefcase, Plus, Trash2, Pencil, Loader2, Calendar, AlertTriangle, X } from 'lucide-react'
import type { EmploymentHistory } from '@/generated/prisma'

interface EmploymentHistoryListProps {
  employmentHistory: EmploymentHistory[]
}

interface FormData {
  employerName: string
  jobTitle: string
  startDate: string
  endDate: string
  isCurrent: boolean
  responsibilities: string
  reasonForLeaving: string
}

const emptyForm: FormData = {
  employerName: '',
  jobTitle: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  responsibilities: '',
  reasonForLeaving: '',
}

export function EmploymentHistoryList({ employmentHistory }: EmploymentHistoryListProps) {
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>(emptyForm)

  // Check for gaps in employment history
  const gaps = checkForGaps(employmentHistory)
  const fiveYearsAgo = new Date()
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5)
  const hasFullHistory = employmentHistory.length > 0 &&
    employmentHistory.some(job => new Date(job.startDate) <= fiveYearsAgo)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/staff/employment-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          endDate: formData.isCurrent ? null : formData.endDate || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to add employment')
      }

      setFormData(emptyForm)
      setIsAdding(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/staff/employment-history/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          endDate: formData.isCurrent ? null : formData.endDate || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update employment')
      }

      setFormData(emptyForm)
      setEditingId(null)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this employment record?')) return

    setDeletingId(id)
    setError(null)

    try {
      const response = await fetch(`/api/staff/employment-history/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete employment')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setDeletingId(null)
    }
  }

  const startEditing = (job: EmploymentHistory) => {
    setFormData({
      employerName: job.employerName,
      jobTitle: job.jobTitle,
      startDate: new Date(job.startDate).toISOString().split('T')[0],
      endDate: job.endDate ? new Date(job.endDate).toISOString().split('T')[0] : '',
      isCurrent: job.isCurrent,
      responsibilities: job.responsibilities || '',
      reasonForLeaving: job.reasonForLeaving || '',
    })
    setEditingId(job.id)
    setIsAdding(false)
  }

  const cancelForm = () => {
    setFormData(emptyForm)
    setIsAdding(false)
    setEditingId(null)
    setError(null)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      month: 'short',
      year: 'numeric',
    }).format(new Date(date))
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-semibold text-gray-900">Employment History</h2>
          </div>
          {!isAdding && !editingId && (
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Please provide your complete employment history for the last 5 years
        </p>
      </div>

      {/* Warning messages */}
      {(gaps.length > 0 || !hasFullHistory) && employmentHistory.length > 0 && (
        <div className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Employment History Incomplete</p>
              {gaps.length > 0 && (
                <p className="text-sm text-amber-700 mt-1">
                  There are gaps in your employment history that need to be explained.
                </p>
              )}
              {!hasFullHistory && (
                <p className="text-sm text-amber-700 mt-1">
                  Please add employment records going back at least 5 years.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <form onSubmit={editingId ? handleEdit : handleAdd} className="p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">
              {editingId ? 'Edit Employment' : 'Add Employment'}
            </h3>
            <button
              type="button"
              onClick={cancelForm}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="employerName" className="block text-sm font-medium text-gray-700 mb-1">
                Employer Name *
              </label>
              <input
                type="text"
                id="employerName"
                name="employerName"
                value={formData.employerName}
                onChange={handleChange}
                required
                placeholder="e.g., Sunrise Care Home"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                required
                placeholder="e.g., Care Assistant"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date {formData.isCurrent ? '(Current)' : '*'}
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                disabled={formData.isCurrent}
                required={!formData.isCurrent}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isCurrent"
                  checked={formData.isCurrent}
                  onChange={handleChange}
                  className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700">I currently work here</span>
              </label>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700 mb-1">
                Key Responsibilities
              </label>
              <textarea
                id="responsibilities"
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                rows={2}
                placeholder="Brief description of your main duties..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {!formData.isCurrent && (
              <div className="md:col-span-2">
                <label htmlFor="reasonForLeaving" className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Leaving
                </label>
                <input
                  type="text"
                  id="reasonForLeaving"
                  name="reasonForLeaving"
                  value={formData.reasonForLeaving}
                  onChange={handleChange}
                  placeholder="e.g., Career progression, relocation..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : editingId ? (
                'Update'
              ) : (
                'Add Employment'
              )}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Employment List */}
      {employmentHistory.length === 0 && !isAdding ? (
        <div className="p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Employment History</h3>
          <p className="text-gray-500 mb-4">
            Add your employment history for the last 5 years to complete your profile
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Employment
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {employmentHistory.map((job) => (
            <div key={job.id} className="p-6 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">{job.jobTitle}</h3>
                  {job.isCurrent && (
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{job.employerName}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDate(job.startDate)} - {job.endDate ? formatDate(job.endDate) : 'Present'}
                  </span>
                </div>
                {job.responsibilities && (
                  <p className="text-sm text-gray-500 mt-2">{job.responsibilities}</p>
                )}
                {job.reasonForLeaving && !job.isCurrent && (
                  <p className="text-sm text-gray-400 mt-1">
                    <span className="font-medium">Left:</span> {job.reasonForLeaving}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => startEditing(job)}
                  disabled={editingId === job.id}
                  className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  disabled={deletingId === job.id}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deletingId === job.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Helper function to detect gaps in employment history
function checkForGaps(history: EmploymentHistory[]): { start: Date; end: Date }[] {
  if (history.length < 2) return []

  const gaps: { start: Date; end: Date }[] = []
  const sorted = [...history].sort((a, b) =>
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  )

  for (let i = 0; i < sorted.length - 1; i++) {
    const currentEnd = sorted[i].endDate ? new Date(sorted[i].endDate!) : new Date()
    const nextStart = new Date(sorted[i + 1].startDate)

    // Calculate gap in days
    const gapDays = (new Date(sorted[i].startDate).getTime() - currentEnd.getTime()) / (1000 * 60 * 60 * 24)

    // If gap is more than 30 days, flag it
    if (gapDays > 30) {
      gaps.push({
        start: new Date(sorted[i + 1].endDate || sorted[i + 1].startDate),
        end: new Date(sorted[i].startDate),
      })
    }
  }

  return gaps
}
