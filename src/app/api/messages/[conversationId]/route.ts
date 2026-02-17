import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Get messages in a specific conversation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { conversationId } = await params

    // Verify user is a participant in this conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { participant1Id: user.id },
          { participant2Id: user.id },
        ],
      },
      include: {
        participant1: {
          include: {
            careStaff: {
              select: { firstName: true, lastName: true, profilePhoto: true, staffType: true },
            },
            careHome: {
              select: { name: true, logo: true },
            },
          },
        },
        participant2: {
          include: {
            careStaff: {
              select: { firstName: true, lastName: true, profilePhoto: true, staffType: true },
            },
            careHome: {
              select: { name: true, logo: true },
            },
          },
        },
      },
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Get messages
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          include: {
            careStaff: {
              select: { firstName: true, lastName: true, profilePhoto: true },
            },
            careHome: {
              select: { name: true, logo: true },
            },
          },
        },
      },
    })

    // Mark unread messages as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: user.id,
        read: false,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    })

    // Get other participant info
    const otherParticipant =
      conversation.participant1Id === user.id
        ? conversation.participant2
        : conversation.participant1

    // Format response
    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      createdAt: msg.createdAt,
      senderId: msg.senderId,
      isOwn: msg.senderId === user.id,
      read: msg.read,
      sender: {
        name: msg.sender.careHome
          ? msg.sender.careHome.name
          : msg.sender.careStaff
          ? `${msg.sender.careStaff.firstName} ${msg.sender.careStaff.lastName.charAt(0)}.`
          : 'Unknown',
        image: msg.sender.careHome?.logo || msg.sender.careStaff?.profilePhoto,
      },
    }))

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        otherParticipant: {
          id: otherParticipant.id,
          name: otherParticipant.careHome
            ? otherParticipant.careHome.name
            : otherParticipant.careStaff
            ? `${otherParticipant.careStaff.firstName} ${otherParticipant.careStaff.lastName.charAt(0)}.`
            : 'Unknown',
          image: otherParticipant.careHome?.logo || otherParticipant.careStaff?.profilePhoto,
          type: otherParticipant.careHome ? 'CARE_HOME' : 'CARE_STAFF',
          role: otherParticipant.careStaff?.staffType,
        },
      },
      messages: formattedMessages,
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}
