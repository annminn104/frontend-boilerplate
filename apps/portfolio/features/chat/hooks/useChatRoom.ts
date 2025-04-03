import { useState, useEffect } from 'react'
import { trpc } from '@/lib/trpc'
import type { Room, RoomEvent, Participant } from '../types/chat'

export function useChatRoom(roomId: string) {
  const [room, setRoom] = useState<Room | null>(null)
  const utils = trpc.useUtils()

  const { data: roomData, isLoading } = trpc.chat.getRoom.useQuery({ roomId }, { enabled: !!roomId })

  const { mutateAsync: joinRoom } = trpc.chat.joinRoom.useMutation({
    onSuccess: () => {
      utils.chat.getRoom.invalidate({ roomId })
    },
  })

  const { mutateAsync: leaveRoom } = trpc.chat.leaveRoom.useMutation({
    onSuccess: () => {
      utils.chat.getRoom.invalidate({ roomId })
    },
  })

  // Subscribe to room events
  trpc.chat.onRoomEvent.useSubscription(
    { roomId },
    {
      enabled: !!roomId && !!room,
      onData: (data: RoomEvent) => {
        if (!room) return

        if (data.type === 'participantJoined' && data.participant) {
          setRoom({
            ...room,
            participants: [...room.participants, data.participant],
          })
        } else if (data.type === 'participantLeft' && data.participantId) {
          setRoom({
            ...room,
            participants: room.participants.filter(p => p.id !== data.participantId),
          })
        }
      },
      onError: err => {
        console.error('Room subscription error:', err)
      },
    }
  )

  // Update room data when it changes
  useEffect(() => {
    if (roomData) {
      setRoom(roomData)
    }
  }, [roomData])

  return {
    room,
    isLoading,
    joinRoom: () => joinRoom({ roomId }),
    leaveRoom: () => leaveRoom({ roomId }),
  }
}
