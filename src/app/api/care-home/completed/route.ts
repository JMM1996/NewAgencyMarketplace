import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
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

    // Get date filters from query params
    const searchParams = request.nextUrl.searchParams
    const fromDate = searchParams.get('from')
    const toDate = searchParams.get('to')

    // Build date filter
    const dateFilter: { gte?: Date; lte?: Date } = {}
    if (fromDate) {
      dateFilter.gte = new Date(fromDate)
    }
    if (toDate) {
      // Add one day to include the end date fully
      const endDate = new Date(toDate)
      endDate.setDate(endDate.getDate() + 1)
      dateFilter.lte = endDate
    }

    // Get completed shifts with date filter
    const shifts = await prisma.shift.findMany({
      where: {
        careHomeId: careHome.id,
        status: 'COMPLETED',
        ...(Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {}),
      },
      orderBy: { date: 'desc' },
      include: {
        bookings: {
          where: { status: 'COMPLETED' },
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

    return NextResponse.json({ shifts })
  } catch (error) {
    console.error('Error fetching completed shifts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch completed shifts' },
      { status: 500 }
    )
  }
}
