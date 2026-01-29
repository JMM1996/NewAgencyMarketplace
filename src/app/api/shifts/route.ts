import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { StaffType, ShiftType } from '@/generated/prisma'

// GET - List shifts (public, with optional filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const location = searchParams.get('location')
    const role = searchParams.get('role') as StaffType | null
    const shiftType = searchParams.get('shiftType') as ShiftType | null
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const minRate = searchParams.get('minRate')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: Record<string, unknown> = {
      status: 'OPEN',
      date: { gte: new Date() },
    }

    if (location) {
      where.careHome = {
        OR: [
          { city: { contains: location, mode: 'insensitive' } },
          { postcode: { startsWith: location.toUpperCase() } },
        ],
      }
    }

    if (role) {
      where.requiredRole = role
    }

    if (shiftType) {
      where.shiftType = shiftType
    }

    if (dateFrom) {
      where.date = { ...where.date as object, gte: new Date(dateFrom) }
    }

    if (dateTo) {
      where.date = { ...where.date as object, lte: new Date(dateTo) }
    }

    if (minRate) {
      where.hourlyRate = { gte: parseFloat(minRate) }
    }

    const [shifts, total] = await Promise.all([
      prisma.shift.findMany({
        where,
        include: {
          careHome: {
            select: {
              id: true,
              name: true,
              city: true,
              postcode: true,
              careHomeType: true,
              averageRating: true,
              verified: true,
            },
          },
          _count: {
            select: { bookings: true },
          },
        },
        orderBy: { date: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.shift.count({ where }),
    ])

    return NextResponse.json({
      shifts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching shifts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shifts' },
      { status: 500 }
    )
  }
}

// POST - Create a new shift (care homes only)
const createShiftSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  requiredRole: z.nativeEnum(StaffType),
  shiftType: z.nativeEnum(ShiftType).default('DAY'),
  date: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid date'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  breakDuration: z.number().min(0).default(30),
  hourlyRate: z.number().positive('Rate must be positive'),
  uniformProvided: z.boolean().default(false),
  parkingAvailable: z.boolean().default(true),
  specialRequirements: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'CARE_HOME') {
      return NextResponse.json(
        { error: 'Only care homes can post shifts' },
        { status: 403 }
      )
    }

    const careHome = await prisma.careHome.findUnique({
      where: { userId: session.user.id },
    })

    if (!careHome) {
      return NextResponse.json(
        { error: 'Care home profile not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validated = createShiftSchema.parse(body)

    // Calculate total pay
    const [startHour, startMin] = validated.startTime.split(':').map(Number)
    const [endHour, endMin] = validated.endTime.split(':').map(Number)
    let totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin)
    if (totalMinutes < 0) totalMinutes += 24 * 60 // Overnight shift
    const workingMinutes = totalMinutes - validated.breakDuration
    const totalPay = (workingMinutes / 60) * validated.hourlyRate

    const shift = await prisma.shift.create({
      data: {
        careHomeId: careHome.id,
        title: validated.title,
        description: validated.description,
        requiredRole: validated.requiredRole,
        shiftType: validated.shiftType,
        date: new Date(validated.date),
        startTime: validated.startTime,
        endTime: validated.endTime,
        breakDuration: validated.breakDuration,
        hourlyRate: validated.hourlyRate,
        totalPay,
        uniformProvided: validated.uniformProvided,
        parkingAvailable: validated.parkingAvailable,
        specialRequirements: validated.specialRequirements,
      },
      include: {
        careHome: {
          select: {
            name: true,
            city: true,
          },
        },
      },
    })

    // Update care home stats
    await prisma.careHome.update({
      where: { id: careHome.id },
      data: { totalShiftsPosted: { increment: 1 } },
    })

    return NextResponse.json(shift, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating shift:', error)
    return NextResponse.json(
      { error: 'Failed to create shift' },
      { status: 500 }
    )
  }
}
