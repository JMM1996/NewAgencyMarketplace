import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { StaffType } from '@/generated/prisma'

const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  bio: z.string().optional().nullable(),
  addressLine1: z.string().optional().nullable(),
  addressLine2: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  county: z.string().optional().nullable(),
  postcode: z.string().min(1, 'Postcode is required'),
  staffType: z.nativeEnum(StaffType),
})

export async function PATCH(request: NextRequest) {
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
    const validated = updateProfileSchema.parse(body)

    const updatedProfile = await prisma.careStaff.update({
      where: { id: careStaff.id },
      data: {
        firstName: validated.firstName,
        lastName: validated.lastName,
        phone: validated.phone,
        bio: validated.bio || null,
        addressLine1: validated.addressLine1 || null,
        addressLine2: validated.addressLine2 || null,
        city: validated.city || null,
        county: validated.county || null,
        postcode: validated.postcode,
        staffType: validated.staffType,
      },
    })

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error('Error updating profile:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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
        qualifications: true,
      },
    })

    if (!careStaff) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json(careStaff)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
