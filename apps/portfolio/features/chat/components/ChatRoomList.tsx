'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc'
import type { RoomListItem } from '../types/chat'

export function ChatRoomList() {
  const router = useRouter()
  const [newRoomName, setNewRoomName] = useState('')
  const utils = trpc.useUtils()

  const { data: rooms = [], isLoading } = trpc.chat.getRooms.useQuery<RoomListItem[]>()

  const { mutateAsync: createRoom } = trpc.chat.createRoom.useMutation({
    onSuccess: room => {
      utils.chat.getRooms.invalidate()
      router.push(`/chat/${room.id}`)
    },
  })

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoomName.trim()) return

    await createRoom({ name: newRoomName.trim() })
    setNewRoomName('')
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="mb-8">
        <h1 className="mb-4 text-2xl font-bold">Chat Rooms</h1>
        <form onSubmit={handleCreateRoom} className="flex space-x-2">
          <input
            type="text"
            value={newRoomName}
            onChange={e => setNewRoomName(e.target.value)}
            placeholder="Enter room name..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!newRoomName.trim()}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
          >
            Create Room
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {rooms.map(room => (
          <Link
            key={room.id}
            href={`/chat/${room.id}`}
            className="block rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-500"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{room.name}</h2>
              <span className="text-sm text-gray-500">
                {room.participant_count} participant{room.participant_count !== 1 ? 's' : ''}
              </span>
            </div>
            {room.last_message && (
              <div className="mt-2 text-sm text-gray-600">
                <p className="line-clamp-1">{room.last_message.content}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {room.last_message.user.email} • {new Date(room.last_message.created_at).toLocaleString()}
                </p>
              </div>
            )}
          </Link>
        ))}

        {rooms.length === 0 && (
          <div className="rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No chat rooms yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}
