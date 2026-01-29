import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { UserRole, StaffType, CareHomeType } from '@/generated/prisma'

// Schema for care staff registration (password handled by Supabase)
const careStaffSchema = z.object({
  userType: z.literal('CARE_STAFF'),
  supabaseUserId: z.string().min(1, 'Supabase user ID is required'),
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  staffType: z.nativeEnum(StaffType).optional(),
})

// Schema for care home registration (password handled by Supabase)
const careHomeSchema = z.object({
  userType: z.literal('CARE_HOME'),
  supabaseUserId: z.string().min(1, 'Supabase user ID is required'),
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Care home name is required'),
  addressLine1: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  postcode: z.string().min(1, 'Postcode is required'),
  careHomeType: z.nativeEnum(CareHomeType).optional(),
})

const registerSchema = z.discriminatedUnion('userType', [
  careStaffSchema,
  careHomeSchema,
])

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = registerSchema.parse(body)

    // Check if user already exists (by Supabase ID or email)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id: validated.supabaseUserId },
          { email: validated.email },
        ],
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    // Create user and profile based on type (auth handled by Supabase)
    if (validated.userType === 'CARE_STAFF') {
      const user = await prisma.user.create({
        data: {
          id: validated.supabaseUserId, // Use Supabase user ID
          email: validated.email,
          password: '', // No password needed - auth handled by Supabase
          role: UserRole.CARE_STAFF,
          careStaff: {
            create: {
              firstName: validated.firstName,
              lastName: validated.lastName,
              staffType: validated.staffType || StaffType.CARE_ASSISTANT,
            },
          },
        },
        include: {
          careStaff: true,
        },
      })

      return NextResponse.json({
        message: 'Registration successful',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: {
            firstName: user.careStaff?.firstName,
            lastName: user.careStaff?.lastName,
          },
        },
      })
    } else {
      const user = await prisma.user.create({
        data: {
          id: validated.supabaseUserId, // Use Supabase user ID
          email: validated.email,
          password: '', // No password needed - auth handled by Supabase
          role: UserRole.CARE_HOME,
          careHome: {
            create: {
              name: validated.name,
              addressLine1: validated.addressLine1,
              city: validated.city,
              postcode: validated.postcode,
              careHomeType: validated.careHomeType || CareHomeType.RESIDENTIAL,
            },
          },
        },
        include: {
          careHome: true,
        },
      })

      return NextResponse.json({
        message: 'Registration successful',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: {
            name: user.careHome?.name,
          },
        },
      })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    )
  }
}
