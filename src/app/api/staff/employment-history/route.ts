import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

const createEmploymentSchema = z.object({
  employerName: z.string().min(1, 'Employer name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().default(false),
  responsibilities: z.string().optional().nullable(),
  reasonForLeaving: z.string().optional().nullable(),
})

export async function GET() {
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
      include: {
        employmentHistory: {
          orderBy: { startDate: 'desc' },
        },
      },
    })

    if (!careStaff) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json(careStaff.employmentHistory)
  } catch (error) {
    console.error('Error fetching employment history:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const validated = createEmploymentSchema.parse(body)

    // If marking as current, clear other current entries
    if (validated.isCurrent) {
      await prisma.employmentHistory.updateMany({
        where: { careStaffId: careStaff.id, isCurrent: true },
        data: { isCurrent: false },
      })
    }

    const employment = await prisma.employmentHistory.create({
      data: {
        careStaffId: careStaff.id,
        employerName: validated.employerName,
        jobTitle: validated.jobTitle,
        startDate: new Date(validated.startDate),
        endDate: validated.endDate ? new Date(validated.endDate) : null,
        isCurrent: validated.isCurrent,
        responsibilities: validated.responsibilities || null,
        reasonForLeaving: validated.reasonForLeaving || null,
      },
    })

    // Update calculated years of experience
    await updateYearsExperience(careStaff.id)

    return NextResponse.json(employment, { status: 201 })
  } catch (error) {
    console.error('Error creating employment history:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to calculate and update years of experience
async function updateYearsExperience(careStaffId: string) {
  const employmentHistory = await prisma.employmentHistory.findMany({
    where: { careStaffId },
  })

  let totalMonths = 0
  const now = new Date()

  for (const job of employmentHistory) {
    const start = new Date(job.startDate)
    const end = job.endDate ? new Date(job.endDate) : now
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    totalMonths += Math.max(0, months)
  }

  const yearsExperience = Math.floor(totalMonths / 12)

  await prisma.careStaff.update({
    where: { id: careStaffId },
    data: { yearsExperience },
  })
}
