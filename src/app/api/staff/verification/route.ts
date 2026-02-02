import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { uploadFile, generateFilePath, STORAGE_BUCKETS } from '@/lib/storage'

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

    const formData = await request.formData()

    const dbsCertificateNumber = formData.get('dbsCertificateNumber') as string
    const dbsIssueDate = formData.get('dbsIssueDate') as string
    const dbsOnUpdateService = formData.get('dbsOnUpdateService') === 'true'
    const rightToWorkConfirmed = formData.get('rightToWorkConfirmed') === 'true'
    const dbsCertificateFile = formData.get('dbsCertificate') as File | null
    const rightToWorkFile = formData.get('rightToWorkDocument') as File | null

    let dbsCertificateUrl = careStaff.dbsCertificateUrl
    let rightToWorkDocumentUrl = careStaff.rightToWorkDocumentUrl

    // Upload DBS certificate if provided
    if (dbsCertificateFile && dbsCertificateFile.size > 0) {
      const filePath = generateFilePath(user.id, 'dbs', dbsCertificateFile.name)
      const { url, error } = await uploadFile(STORAGE_BUCKETS.DOCUMENTS, filePath, dbsCertificateFile)
      if (error) {
        console.error('Error uploading DBS certificate:', error)
        return NextResponse.json({ error: 'Failed to upload DBS certificate' }, { status: 500 })
      }
      dbsCertificateUrl = url
    }

    // Upload Right to Work document if provided
    if (rightToWorkFile && rightToWorkFile.size > 0) {
      const filePath = generateFilePath(user.id, 'right-to-work', rightToWorkFile.name)
      const { url, error } = await uploadFile(STORAGE_BUCKETS.DOCUMENTS, filePath, rightToWorkFile)
      if (error) {
        console.error('Error uploading RTW document:', error)
        return NextResponse.json({ error: 'Failed to upload Right to Work document' }, { status: 500 })
      }
      rightToWorkDocumentUrl = url
    }

    // Determine verification status
    let verificationStatus = careStaff.verificationStatus

    // Check if all required fields are filled for submission
    const hasAllRequired =
      dbsCertificateNumber &&
      dbsIssueDate &&
      dbsCertificateUrl &&
      rightToWorkConfirmed &&
      rightToWorkDocumentUrl

    // Only change to PENDING_REVIEW if currently INCOMPLETE or REJECTED and all fields are filled
    if (hasAllRequired && (verificationStatus === 'INCOMPLETE' || verificationStatus === 'REJECTED')) {
      verificationStatus = 'PENDING_REVIEW'
    }

    // If already verified and documents are being updated, set back to pending
    if (verificationStatus === 'VERIFIED' && (dbsCertificateFile || rightToWorkFile)) {
      verificationStatus = 'PENDING_REVIEW'
    }

    const updatedCareStaff = await prisma.careStaff.update({
      where: { id: careStaff.id },
      data: {
        dbsCertificateNumber: dbsCertificateNumber || null,
        dbsIssueDate: dbsIssueDate ? new Date(dbsIssueDate) : null,
        dbsOnUpdateService,
        dbsCertificateUrl,
        rightToWorkConfirmed,
        rightToWorkDocumentUrl,
        verificationStatus,
        // Clear verification notes if resubmitting after rejection
        verificationNotes: verificationStatus === 'PENDING_REVIEW' && careStaff.verificationStatus === 'REJECTED'
          ? null
          : careStaff.verificationNotes,
      },
    })

    return NextResponse.json({
      success: true,
      verificationStatus: updatedCareStaff.verificationStatus,
    })
  } catch (error) {
    console.error('Error updating verification:', error)
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
      select: {
        dbsCertificateNumber: true,
        dbsIssueDate: true,
        dbsOnUpdateService: true,
        dbsCertificateUrl: true,
        rightToWorkConfirmed: true,
        rightToWorkDocumentUrl: true,
        verificationStatus: true,
        verificationNotes: true,
        verifiedAt: true,
      },
    })

    if (!careStaff) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json(careStaff)
  } catch (error) {
    console.error('Error fetching verification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
