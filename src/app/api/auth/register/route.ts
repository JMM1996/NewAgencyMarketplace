import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { UserRole, StaffType, CareHomeType } from '@/generated/prisma'

const careStaffSchema = z.object({
  userType: z.literal('CARE_STAFF'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  staffType: z.nativeEnum(StaffType).optional(),
})

const careHomeSchema = z.object({
  userType: z.literal('CARE_HOME'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
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

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 12)

    // Create user and profile based on type
    if (validated.userType === 'CARE_STAFF') {
      const user = await prisma.user.create({
        data: {
          email: validated.email,
          password: hashedPassword,
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
          email: validated.email,
          password: hashedPassword,
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
