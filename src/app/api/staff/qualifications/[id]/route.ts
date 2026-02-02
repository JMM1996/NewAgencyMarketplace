import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'CARE_STAFF') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get the qualification and verify ownership
    const qualification = await prisma.qualification.findUnique({
      where: { id },
      include: {
        careStaff: true,
      },
    })

    if (!qualification) {
      return NextResponse.json({ error: 'Qualification not found' }, { status: 404 })
    }

    if (qualification.careStaff.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.qualification.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting qualification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
