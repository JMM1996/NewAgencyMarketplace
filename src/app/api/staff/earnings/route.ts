import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

const PLATFORM_FEE_RATE = 0.15 // 15% platform fee

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'CARE_STAFF') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const careStaff = await prisma.careStaff.findUnique({
      where: { userId: user.id },
    })

    if (!careStaff) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Get completed bookings within the date range
    const completedBookings = await prisma.booking.findMany({
      where: {
        careStaffId: careStaff.id,
        status: 'COMPLETED',
        shift: {
          date: {
            gte: startDate ? new Date(startDate) : undefined,
            lte: endDate ? new Date(endDate) : undefined,
          },
        },
      },
      include: {
        shift: {
          include: {
            careHome: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        shift: {
          date: 'desc',
        },
      },
    })

    // Calculate earnings for each booking
    const earnings = completedBookings.map((booking) => {
      // Calculate hours from check-in/out if available, otherwise use shift times
      let hoursWorked: number
      if (booking.checkedInAt && booking.checkedOutAt) {
        hoursWorked = (booking.checkedOutAt.getTime() - booking.checkedInAt.getTime()) / (1000 * 60 * 60)
      } else {
        hoursWorked = calculateHours(
          booking.shift.startTime,
          booking.shift.endTime
        )
      }

      // Use totalEarned if available, otherwise calculate from hours worked
      const grossPay = booking.totalEarned?.toNumber() || (hoursWorked * booking.agreedRate.toNumber())
      const platformFee = grossPay * PLATFORM_FEE_RATE
      const netPay = grossPay - platformFee

      return {
        id: booking.id,
        date: booking.shift.date.toISOString(),
        shiftTitle: booking.shift.title,
        careHomeName: booking.shift.careHome.name,
        hoursWorked,
        grossPay,
        platformFee,
        netPay,
      }
    })

    // Calculate summary
    const summary = earnings.reduce(
      (acc, earning) => ({
        totalGross: acc.totalGross + earning.grossPay,
        totalFees: acc.totalFees + earning.platformFee,
        totalNet: acc.totalNet + earning.netPay,
        shiftCount: acc.shiftCount + 1,
      }),
      { totalGross: 0, totalFees: 0, totalNet: 0, shiftCount: 0 }
    )

    return NextResponse.json({
      earnings,
      summary,
    })
  } catch (error) {
    console.error('Error fetching earnings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function calculateHours(startTime: string, endTime: string): number {
  const [startHour, startMin] = startTime.split(':').map(Number)
  const [endHour, endMin] = endTime.split(':').map(Number)

  let startMinutes = startHour * 60 + startMin
  let endMinutes = endHour * 60 + endMin

  // Handle overnight shifts
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60
  }

  return (endMinutes - startMinutes) / 60
}
