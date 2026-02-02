import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { sendBookingConfirmedEmail, sendBookingRejectedEmail } from '@/lib/email'

const updateBookingSchema = z.object({
  status: z.enum(['CONFIRMED', 'REJECTED', 'CANCELLED_BY_HOME']),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validated = updateBookingSchema.parse(body)

    // Get the booking with related data
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        shift: {
          include: {
            careHome: true,
          },
        },
        careStaff: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Verify the user owns the care home
    if (user.role !== 'CARE_HOME' || booking.shift.careHome.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if booking can be updated
    if (booking.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Booking has already been processed' },
        { status: 400 }
      )
    }

    if (validated.status === 'CONFIRMED') {
      // Use a transaction to confirm this booking and update related records
      await prisma.$transaction(async (tx) => {
        // Confirm this booking
        await tx.booking.update({
          where: { id },
          data: {
            status: 'CONFIRMED',
            confirmedAt: new Date(),
          },
        })

        // Update shift status to FILLED
        await tx.shift.update({
          where: { id: booking.shiftId },
          data: { status: 'FILLED' },
        })

        // Reject all other pending bookings for this shift
        await tx.booking.updateMany({
          where: {
            shiftId: booking.shiftId,
            id: { not: id },
            status: 'PENDING',
          },
          data: { status: 'REJECTED' },
        })
      })

      // Send confirmation email to the staff member
      try {
        await sendBookingConfirmedEmail({
          to: booking.careStaff.user.email,
          staffName: booking.careStaff.firstName,
          shiftTitle: booking.shift.title,
          shiftDate: booking.shift.date,
          shiftTime: `${booking.shift.startTime} - ${booking.shift.endTime}`,
          careHomeName: booking.shift.careHome.name,
          careHomeAddress: `${booking.shift.careHome.addressLine1}, ${booking.shift.careHome.city}, ${booking.shift.careHome.postcode}`,
          hourlyRate: booking.agreedRate.toString(),
        })
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError)
        // Don't fail the request if email fails
      }

      return NextResponse.json({ success: true, status: 'CONFIRMED' })
    } else if (validated.status === 'REJECTED') {
      // Reject this booking
      await prisma.booking.update({
        where: { id },
        data: { status: 'REJECTED' },
      })

      // Send rejection email to the staff member
      try {
        await sendBookingRejectedEmail({
          to: booking.careStaff.user.email,
          staffName: booking.careStaff.firstName,
          shiftTitle: booking.shift.title,
          shiftDate: booking.shift.date,
          careHomeName: booking.shift.careHome.name,
        })
      } catch (emailError) {
        console.error('Failed to send rejection email:', emailError)
        // Don't fail the request if email fails
      }

      return NextResponse.json({ success: true, status: 'REJECTED' })
    }

    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  } catch (error) {
    console.error('Error updating booking:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
