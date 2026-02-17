import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

// PATCH - Update shift status (care homes only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user || user.role !== 'CARE_HOME') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const careHome = await prisma.careHome.findUnique({
      where: { userId: user.id },
    })

    if (!careHome) {
      return NextResponse.json({ error: 'Care home not found' }, { status: 404 })
    }

    const body = await request.json()
    const { status } = body

    if (!['OPEN', 'FILLED', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Update the shift
    const shift = await prisma.shift.update({
      where: { id, careHomeId: careHome.id },
      data: { status },
    })

    // If marking as completed, also update confirmed bookings
    if (status === 'COMPLETED') {
      await prisma.booking.updateMany({
        where: {
          shiftId: id,
          status: 'CONFIRMED'
        },
        data: { status: 'COMPLETED' }
      })
    }

    return NextResponse.json({ shift })
  } catch (error) {
    console.error('Error updating shift:', error)
    return NextResponse.json(
      { error: 'Failed to update shift' },
      { status: 500 }
    )
  }
}
