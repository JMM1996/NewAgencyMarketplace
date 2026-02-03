'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GraduationCap, Plus, Trash2, Loader2, CheckCircle, Calendar } from 'lucide-react'
import type { Qualification } from '@/generated/prisma'

interface QualificationsListProps {
  qualifications: Qualification[]
  careStaffId: string
}

export function QualificationsList({ qualifications, careStaffId }: QualificationsListProps) {
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [newQualification, setNewQualification] = useState({
    name: '',
    issuingBody: '',
    issueDate: '',
    expiryDate: '',
  })

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/staff/qualifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newQualification,
          careStaffId,
          issueDate: newQualification.issueDate || null,
          expiryDate: newQualification.expiryDate || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to add qualification')
      }

      setNewQualification({ name: '', issuingBody: '', issueDate: '', expiryDate: '' })
      setIsAdding(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this qualification?')) return

    setDeletingId(id)
    setError(null)

    try {
      const response = await fetch(`/api/staff/qualifications/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete qualification')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return null
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
            <GraduationCap className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-semibold text-gray-900">Qualifications & Certifications</h2>
          </div>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </button>
          )}
        </div>
        <p className="text-sm text-teal-600 mt-2">
          We collate this data and display it simply to care homes
        </p>
      </div>

      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Add New Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="p-6 border-b border-gray-100 bg-gray-50">
          <h3 className="font-medium text-gray-900 mb-4">Add Qualification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Qualification Name *
              </label>
              <input
                type="text"
                id="name"
                value={newQualification.name}
                onChange={(e) => setNewQualification({ ...newQualification, name: e.target.value })}
                required
                placeholder="e.g., NVQ Level 3 in Health and Social Care"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="issuingBody" className="block text-sm font-medium text-gray-700 mb-1">
                Issuing Body
              </label>
              <input
                type="text"
                id="issuingBody"
                value={newQualification.issuingBody}
                onChange={(e) => setNewQualification({ ...newQualification, issuingBody: e.target.value })}
                placeholder="e.g., City & Guilds"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Issue Date
              </label>
              <input
                type="date"
                id="issueDate"
                value={newQualification.issueDate}
                onChange={(e) => setNewQualification({ ...newQualification, issueDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date (if applicable)
              </label>
              <input
                type="date"
                id="expiryDate"
                value={newQualification.expiryDate}
                onChange={(e) => setNewQualification({ ...newQualification, expiryDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
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
                  Adding...
                </>
              ) : (
                'Add Qualification'
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false)
                setNewQualification({ name: '', issuingBody: '', issueDate: '', expiryDate: '' })
              }}
              className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Qualifications List */}
      {qualifications.length === 0 && !isAdding ? (
        <div className="p-12 text-center">
          <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Qualifications Added</h3>
          <p className="text-gray-500 mb-4">
            Add your qualifications and certifications to build trust with care homes
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Qualification
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {qualifications.map((qual) => (
            <div key={qual.id} className="p-6 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">{qual.name}</h3>
                  {qual.verified && (
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </span>
                  )}
                </div>
                {qual.issuingBody && (
                  <p className="text-sm text-gray-600 mt-1">{qual.issuingBody}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  {qual.issueDate && (
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Issued: {formatDate(qual.issueDate)}
                    </span>
                  )}
                  {qual.expiryDate && (
                    <span className={`flex items-center ${new Date(qual.expiryDate) < new Date() ? 'text-red-600' : ''}`}>
                      Expires: {formatDate(qual.expiryDate)}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleDelete(qual.id)}
                disabled={deletingId === qual.id}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                {deletingId === qual.id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
