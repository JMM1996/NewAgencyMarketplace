import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// POST - Apply for a shift (care staff only)
const applySchema = z.object({
  shiftId: z.string().min(1, 'Shift ID is required'),
  notes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'CARE_STAFF') {
      return NextResponse.json(
        { error: 'Only care staff can apply for shifts' },
        { status: 403 }
      )
    }

    const careStaff = await prisma.careStaff.findUnique({
      where: { userId: session.user.id },
    })

    if (!careStaff) {
      return NextResponse.json(
        { error: 'Care staff profile not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validated = applySchema.parse(body)

    // Check if shift exists and is open
    const shift = await prisma.shift.findUnique({
      where: { id: validated.shiftId },
      include: { careHome: true },
    })

    if (!shift) {
      return NextResponse.json({ error: 'Shift not found' }, { status: 404 })
    }

    if (shift.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'This shift is no longer available' },
        { status: 400 }
      )
    }

    // Check if already applied
    const existingBooking = await prisma.booking.findUnique({
      where: {
        shiftId_careStaffId: {
          shiftId: validated.shiftId,
          careStaffId: careStaff.id,
        },
      },
    })

    if (existingBooking) {
      return NextResponse.json(
        { error: 'You have already applied for this shift' },
        { status: 400 }
      )
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        shiftId: validated.shiftId,
        careStaffId: careStaff.id,
        agreedRate: shift.hourlyRate,
        staffNotes: validated.notes,
      },
      include: {
        shift: {
          include: {
            careHome: {
              select: {
                name: true,
                city: true,
              },
            },
          },
        },
      },
    })

    // Create notification for care home
    await prisma.notification.create({
      data: {
        userId: shift.careHome.userId,
        type: 'BOOKING_REQUEST',
        title: 'New Shift Application',
        message: `${careStaff.firstName} ${careStaff.lastName} has applied for your ${shift.title} shift.`,
        link: `/dashboard/care-home/shifts/${shift.id}`,
      },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to apply for shift' },
      { status: 500 }
    )
  }
}

// GET - Get user's bookings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    if (session.user.role === 'CARE_STAFF') {
      const careStaff = await prisma.careStaff.findUnique({
        where: { userId: session.user.id },
      })

      if (!careStaff) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
      }

      const where: Record<string, unknown> = { careStaffId: careStaff.id }
      if (status) where.status = status

      const bookings = await prisma.booking.findMany({
        where,
        include: {
          shift: {
            include: {
              careHome: {
                select: {
                  name: true,
                  city: true,
                  postcode: true,
                },
              },
            },
          },
        },
        orderBy: { shift: { date: 'desc' } },
      })

      return NextResponse.json(bookings)
    } else if (session.user.role === 'CARE_HOME') {
      const careHome = await prisma.careHome.findUnique({
        where: { userId: session.user.id },
      })

      if (!careHome) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
      }

      const where: Record<string, unknown> = {
        shift: { careHomeId: careHome.id },
      }
      if (status) where.status = status

      const bookings = await prisma.booking.findMany({
        where,
        include: {
          shift: true,
          careStaff: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              staffType: true,
              averageRating: true,
              totalShiftsCompleted: true,
              dbsVerified: true,
            },
          },
        },
        orderBy: { appliedAt: 'desc' },
      })

      return NextResponse.json(bookings)
    }

    return NextResponse.json({ error: 'Invalid user role' }, { status: 400 })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
