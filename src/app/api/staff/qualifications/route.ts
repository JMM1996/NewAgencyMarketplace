import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

const createQualificationSchema = z.object({
  careStaffId: z.string().min(1),
  name: z.string().min(1, 'Qualification name is required'),
  issuingBody: z.string().optional().nullable(),
  issueDate: z.string().optional().nullable(),
  expiryDate: z.string().optional().nullable(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'CARE_STAFF') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validated = createQualificationSchema.parse(body)

    // Verify the care staff belongs to the user
    const careStaff = await prisma.careStaff.findUnique({
      where: { id: validated.careStaffId },
    })

    if (!careStaff || careStaff.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const qualification = await prisma.qualification.create({
      data: {
        careStaffId: validated.careStaffId,
        name: validated.name,
        issuingBody: validated.issuingBody || null,
        issueDate: validated.issueDate ? new Date(validated.issueDate) : null,
        expiryDate: validated.expiryDate ? new Date(validated.expiryDate) : null,
      },
    })

    return NextResponse.json(qualification, { status: 201 })
  } catch (error) {
    console.error('Error creating qualification:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
