'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  MessageCircle,
  Send,
  User,
  Building2,
  Loader2,
} from 'lucide-react'
import { format, isToday, isYesterday } from 'date-fns'

type Participant = {
  id: string
  name: string
  image?: string | null
  type: 'CARE_HOME' | 'CARE_STAFF'
  role?: string
}

type Message = {
  id: string
  content: string
  createdAt: string
  senderId: string
  isOwn: boolean
  read: boolean
  sender: {
    name: string
    image?: string | null
  }
}

type Conversation = {
  id: string
  otherParticipant: Participant
  lastMessage: {
    content: string
    createdAt: string
    isOwn: boolean
  } | null
  unreadCount: number
  lastMessageAt: string
}

function formatMessageTime(date: string) {
  const d = new Date(date)
  if (isToday(d)) {
    return format(d, 'HH:mm')
  } else if (isYesterday(d)) {
    return 'Yesterday'
  }
  return format(d, 'd MMM')
}

function formatMessageDate(date: string) {
  const d = new Date(date)
  if (isToday(d)) {
    return 'Today'
  } else if (isYesterday(d)) {
    return 'Yesterday'
  }
  return format(d, 'EEEE, d MMMM yyyy')
}

export default function MessagesPage() {
  const searchParams = useSearchParams()
  const targetUserId = searchParams.get('userId')
  const bookingId = searchParams.get('bookingId')

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch conversations
  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await fetch('/api/messages')
        if (res.ok) {
          const data = await res.json()
          setConversations(data.conversations || [])

          // If we have a target user from URL, find or prepare that conversation
          if (targetUserId) {
            const existing = data.conversations.find(
              (c: Conversation) => c.otherParticipant.id === targetUserId
            )
            if (existing) {
              setSelectedConversation(existing.id)
            } else {
              // New conversation - will be created on first message
              setSelectedConversation('new')
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchConversations()
  }, [targetUserId])

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (!selectedConversation || selectedConversation === 'new') {
      setMessages([])
      return
    }

    async function fetchMessages() {
      setLoadingMessages(true)
      try {
        const res = await fetch(`/api/messages/${selectedConversation}`)
        if (res.ok) {
          const data = await res.json()
          setMessages(data.messages || [])
          setCurrentParticipant(data.conversation.otherParticipant)

          // Update unread count in conversations list
          setConversations((prev) =>
            prev.map((c) =>
              c.id === selectedConversation ? { ...c, unreadCount: 0 } : c
            )
          )
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error)
      } finally {
        setLoadingMessages(false)
      }
    }
    fetchMessages()
  }, [selectedConversation])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    const receiverId = selectedConversation === 'new' ? targetUserId : currentParticipant?.id
    if (!receiverId) return

    setSending(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId,
          content: newMessage.trim(),
          bookingId: bookingId || undefined,
        }),
      })

      if (res.ok) {
        const data = await res.json()

        // Add message to list
        setMessages((prev) => [...prev, data.message])
        setNewMessage('')

        // If this was a new conversation, update the conversation ID
        if (selectedConversation === 'new') {
          setSelectedConversation(data.conversationId)
          // Refresh conversations list
          const convRes = await fetch('/api/messages')
          if (convRes.ok) {
            const convData = await convRes.json()
            setConversations(convData.conversations || [])
          }
        }
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  // Group messages by date
  const groupedMessages = messages.reduce((acc, msg) => {
    const date = format(new Date(msg.createdAt), 'yyyy-MM-dd')
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(msg)
    return acc
  }, {} as Record<string, Message[]>)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Conversations List */}
      <div
        className={`w-full md:w-80 lg:w-96 border-r border-gray-200 flex flex-col ${
          selectedConversation ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Messages</h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 && !targetUserId ? (
            <div className="p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Messages Yet</h3>
              <p className="text-gray-500 text-sm">
                When you message a care home or carer, your conversations will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    setSelectedConversation(conv.id)
                    setCurrentParticipant(conv.otherParticipant)
                  }}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 text-left transition-colors ${
                    selectedConversation === conv.id ? 'bg-teal-50' : ''
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {conv.otherParticipant.image ? (
                      <Image
                        src={conv.otherParticipant.image}
                        alt={conv.otherParticipant.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : conv.otherParticipant.type === 'CARE_HOME' ? (
                      <Building2 className="w-6 h-6 text-gray-400" />
                    ) : (
                      <User className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900 truncate">
                        {conv.otherParticipant.name}
                      </p>
                      {conv.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {formatMessageTime(conv.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    {conv.lastMessage && (
                      <p className="text-sm text-gray-500 truncate">
                        {conv.lastMessage.isOwn && 'You: '}
                        {conv.lastMessage.content}
                      </p>
                    )}
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 bg-teal-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`flex-1 flex flex-col ${
          !selectedConversation ? 'hidden md:flex' : 'flex'
        }`}
      >
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-3">
              <button
                onClick={() => setSelectedConversation(null)}
                className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              {currentParticipant && (
                <>
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {currentParticipant.image ? (
                      <Image
                        src={currentParticipant.image}
                        alt={currentParticipant.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : currentParticipant.type === 'CARE_HOME' ? (
                      <Building2 className="w-5 h-5 text-gray-400" />
                    ) : (
                      <User className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {currentParticipant.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {currentParticipant.type === 'CARE_HOME'
                        ? 'Care Home'
                        : currentParticipant.role?.replace(/_/g, ' ')}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(groupedMessages).map(([date, msgs]) => (
                    <div key={date}>
                      <div className="text-center my-4">
                        <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                          {formatMessageDate(msgs[0].createdAt)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {msgs.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                                msg.isOwn
                                  ? 'bg-teal-600 text-white rounded-br-md'
                                  : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  msg.isOwn ? 'text-teal-100' : 'text-gray-400'
                                }`}
                              >
                                {format(new Date(msg.createdAt), 'HH:mm')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-200 bg-white"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {sending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Select a Conversation
              </h2>
              <p className="text-gray-500">
                Choose a conversation from the list to start messaging.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
