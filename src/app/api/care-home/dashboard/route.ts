import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
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

    // Get all shifts with bookings
    const allShifts = await prisma.shift.findMany({
      where: { careHomeId: careHome.id },
      orderBy: { date: 'asc' },
      include: {
        bookings: {
          include: {
            careStaff: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    })

    // Calculate stats
    const stats = {
      open: allShifts.filter(s => s.status === 'OPEN').length,
      filled: allShifts.filter(s => s.status === 'FILLED').length,
      completed: allShifts.filter(s => s.status === 'COMPLETED').length,
      pending: allShifts.reduce((count, shift) => {
        return count + shift.bookings.filter(b => b.status === 'PENDING').length
      }, 0),
    }

    return NextResponse.json({
      careHome: {
        name: careHome.name,
      },
      allShifts,
      stats,
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
