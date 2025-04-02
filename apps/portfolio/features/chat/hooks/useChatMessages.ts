import { useState, useEffect } from 'react'
import { trpc } from '@/lib/trpc'
import type { Message, RoomEvent } from '../types/chat'

export function useChatMessages(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const utils = trpc.useContext()

  const { mutateAsync: sendMessage } = trpc.chat.sendMessage.useMutation({
    onSuccess: () => {
      utils.chat.getRoom.invalidate({ roomId })
    },
  })

  const { mutateAsync: markAsRead } = trpc.chat.markAsRead.useMutation()

  // Subscribe to room events
  trpc.chat.onRoomEvent.useSubscription(
    { roomId },
    {
      enabled: !!roomId,
      onData: (data: RoomEvent) => {
        if (data.type === 'messageCreated' && data.message) {
          setMessages(prev => {
            const newMessage = data.message
            if (!newMessage) return prev
            return [...prev, newMessage]
          })
        }
      },
      onError: err => {
        console.error('Message subscription error:', err)
      },
    }
  )

  // Update messages when room data changes
  useEffect(() => {
    const roomData = utils.chat.getRoom.getData({ roomId })
    if (roomData?.messages) {
      setMessages(roomData.messages)
    }
  }, [roomId, utils.chat.getRoom])

  return {
    messages,
    sendMessage: (content: string) => sendMessage({ roomId, content }),
    markAsRead: () => markAsRead({ roomId }),
  }
}
