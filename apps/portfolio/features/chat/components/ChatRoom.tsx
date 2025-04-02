'use client'

import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useChatRoom } from '../hooks/useChatRoom'
import { useChatMessages } from '../hooks/useChatMessages'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { ParticipantList } from './ParticipantList'

interface ChatRoomProps {
  roomId: string
}

export function ChatRoom({ roomId }: ChatRoomProps) {
  const { userId } = useAuth()
  const { room, isLoading: isLoadingRoom, joinRoom, leaveRoom } = useChatRoom(roomId)

  const { messages, sendMessage, markAsRead } = useChatMessages(roomId)

  // Join room on mount
  useEffect(() => {
    if (userId && room) {
      joinRoom()
      return () => {
        leaveRoom()
      }
    }
  }, [userId, room, joinRoom, leaveRoom])

  // Mark messages as read when room is focused
  useEffect(() => {
    if (userId && room) {
      markAsRead()
    }
  }, [userId, room, markAsRead])

  if (isLoadingRoom) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Please sign in to join the chat.</p>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Room not found.</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{room.name}</h1>
          <div className="text-sm text-gray-500">
            {room.participants.length} participant{room.participants.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} isOwnMessage={message.userId === userId} />
          ))}
        </div>
      </div>

      {/* Participants */}
      <div className="border-l border-gray-200 bg-white p-4">
        <h2 className="mb-4 text-lg font-semibold">Participants</h2>
        <ParticipantList participants={room.participants} currentUserId={userId} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 bg-white p-4">
        <ChatInput onSendMessage={sendMessage} disabled={!userId} />
      </div>
    </div>
  )
}
