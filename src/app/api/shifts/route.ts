import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'
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
  description: z.string().optional(),
  requiredRole: z.nativeEnum(StaffType),
  date: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid date').optional(),
  dates: z.array(z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid date')).optional(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  breakDuration: z.number().min(0).default(30),
  hourlyRate: z.number().positive('Rate must be positive'),
  uniformProvided: z.boolean().default(false),
  parkingAvailable: z.boolean().default(true),
  paidBreak: z.boolean().default(false),
  mealsProvided: z.boolean().default(false),
  otherAmenities: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'CARE_HOME') {
      return NextResponse.json(
        { error: 'Only care homes can post shifts' },
        { status: 403 }
      )
    }

    const careHome = await prisma.careHome.findUnique({
      where: { userId: user.id },
    })

    if (!careHome) {
      return NextResponse.json(
        { error: 'Care home profile not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validated = createShiftSchema.parse(body)

    // Get dates array - support both single date and multiple dates
    const dates = validated.dates || (validated.date ? [validated.date] : [])

    if (dates.length === 0) {
      return NextResponse.json(
        { error: 'At least one date is required' },
        { status: 400 }
      )
    }

    // Calculate total pay
    const [startHour, startMin] = validated.startTime.split(':').map(Number)
    const [endHour, endMin] = validated.endTime.split(':').map(Number)
    let totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin)
    if (totalMinutes < 0) totalMinutes += 24 * 60 // Overnight shift
    // If paid break, carer gets paid for the full shift including break time
    const workingMinutes = validated.paidBreak ? totalMinutes : totalMinutes - validated.breakDuration
    const totalPay = (workingMinutes / 60) * validated.hourlyRate

    // Generate title from role and postcode (e.g., "Care Assistant, HG2 7DZ")
    const roleLabels: Record<string, string> = {
      CARE_ASSISTANT: 'Care Assistant',
      SENIOR_CARER: 'Senior Care Assistant',
      REGISTERED_NURSE: 'Registered Nurse',
    }
    const roleLabel = roleLabels[validated.requiredRole] || validated.requiredRole
    const title = `${roleLabel}, ${careHome.postcode}`

    // Create shifts for all dates
    const shifts = await Promise.all(
      dates.map(async (date) => {
        return prisma.shift.create({
          data: {
            careHomeId: careHome.id,
            title,
            description: validated.description,
            requiredRole: validated.requiredRole,
            shiftType: 'DAY', // Default shift type
            date: new Date(date),
            startTime: validated.startTime,
            endTime: validated.endTime,
            breakDuration: validated.breakDuration,
            hourlyRate: validated.hourlyRate,
            totalPay,
            uniformProvided: validated.uniformProvided,
            parkingAvailable: validated.parkingAvailable,
            paidBreak: validated.paidBreak,
            mealsProvided: validated.mealsProvided,
            specialRequirements: validated.otherAmenities,
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
      })
    )

    // Update care home stats
    await prisma.careHome.update({
      where: { id: careHome.id },
      data: { totalShiftsPosted: { increment: shifts.length } },
    })

    return NextResponse.json({ shifts, count: shifts.length }, { status: 201 })
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
