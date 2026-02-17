import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

// Schema for sending a message
const sendMessageSchema = z.object({
  receiverId: z.string(),
  content: z.string().min(1).max(2000),
  bookingId: z.string().optional(),
})

// GET - List all conversations for the current user
export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all conversations where user is a participant
    const conversations = await prisma.conversation.findMany({
      where: {
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
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    })

    // Get unread counts per conversation
    const unreadCounts = await Promise.all(
      conversations.map(async (conv) => {
        const count = await prisma.message.count({
          where: {
            conversationId: conv.id,
            receiverId: user.id,
            read: false,
          },
        })
        return { conversationId: conv.id, unreadCount: count }
      })
    )

    // Format conversations with the other participant's info
    const formattedConversations = conversations.map((conv) => {
      const otherParticipant =
        conv.participant1Id === user.id ? conv.participant2 : conv.participant1
      const unread = unreadCounts.find((u) => u.conversationId === conv.id)?.unreadCount || 0
      const lastMessage = conv.messages[0]

      return {
        id: conv.id,
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
        lastMessage: lastMessage
          ? {
              content: lastMessage.content,
              createdAt: lastMessage.createdAt,
              isOwn: lastMessage.senderId === user.id,
            }
          : null,
        unreadCount: unread,
        lastMessageAt: conv.lastMessageAt,
      }
    })

    return NextResponse.json({ conversations: formattedConversations })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}

// POST - Send a message (creates conversation if needed)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validated = sendMessageSchema.parse(body)

    // Check that receiver exists and is a valid user to message
    const receiver = await prisma.user.findUnique({
      where: { id: validated.receiverId },
      include: {
        careStaff: true,
        careHome: true,
      },
    })

    if (!receiver) {
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 })
    }

    // Can't message yourself
    if (receiver.id === user.id) {
      return NextResponse.json({ error: 'Cannot message yourself' }, { status: 400 })
    }

    // Find or create conversation
    // Sort IDs to ensure consistency (participant1 is always the smaller ID)
    const [participant1Id, participant2Id] = [user.id, validated.receiverId].sort()

    let conversation = await prisma.conversation.findFirst({
      where: {
        participant1Id,
        participant2Id,
      },
    })

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participant1Id,
          participant2Id,
          bookingId: validated.bookingId,
        },
      })
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: user.id,
        receiverId: validated.receiverId,
        content: validated.content,
      },
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

    // Update conversation's lastMessageAt
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    })

    return NextResponse.json({
      message: {
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        senderId: message.senderId,
        isOwn: true,
        sender: {
          name: message.sender.careHome
            ? message.sender.careHome.name
            : message.sender.careStaff
            ? `${message.sender.careStaff.firstName} ${message.sender.careStaff.lastName.charAt(0)}.`
            : 'Unknown',
          image: message.sender.careHome?.logo || message.sender.careStaff?.profilePhoto,
        },
      },
      conversationId: conversation.id,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
