'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Loader2 } from 'lucide-react'

interface ShiftStatusActionsProps {
  shiftId: string
  currentStatus: string
}

export function ShiftStatusActions({ shiftId, currentStatus }: ShiftStatusActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleMarkCompleted = async () => {
    if (!confirm('Mark this shift as completed? This will also mark the booking as completed.')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/shifts/${shiftId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update shift')
      }

      router.refresh()
    } catch (error) {
      console.error('Error updating shift:', error)
      alert(error instanceof Error ? error.message : 'Failed to update shift')
    } finally {
      setLoading(false)
    }
  }

  if (currentStatus !== 'FILLED') {
    return null
  }

  return (
    <button
      onClick={handleMarkCompleted}
      disabled={loading}
      className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Updating...
        </>
      ) : (
        <>
          <CheckCircle className="w-4 h-4 mr-2" />
          Mark as Completed
        </>
      )}
    </button>
  )
}
