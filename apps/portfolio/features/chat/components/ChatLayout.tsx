'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { trpc } from '@/lib/trpc'
import type { RoomListItem } from '../types/chat'

interface ChatLayoutProps {
  children: React.ReactNode
}

export function ChatLayout({ children }: ChatLayoutProps) {
  const pathname = usePathname()
  const { signOut } = useAuth()
  const { data: rooms = [], isLoading: isLoadingRooms } = trpc.chat.getRooms.useQuery<RoomListItem[]>()

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-white">
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <h1 className="text-xl font-semibold">Chat</h1>
          <button onClick={() => signOut()} className="text-sm text-gray-500 hover:text-gray-700">
            Sign Out
          </button>
        </div>

        <nav className="p-4">
          <Link
            href="/chat"
            className={`mb-2 block rounded-lg px-4 py-2 ${
              pathname === '/chat' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Rooms
          </Link>

          {isLoadingRooms ? (
            <div className="px-4 py-2 text-sm text-gray-500">Loading rooms...</div>
          ) : (
            <div className="space-y-1">
              {rooms.map(room => (
                <Link
                  key={room.id}
                  href={`/chat/${room.id}`}
                  className={`block rounded-lg px-4 py-2 ${
                    pathname === `/chat/${room.id}` ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{room.name}</span>
                    {room.participant_count > 0 && (
                      <span className="ml-2 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                        {room.participant_count}
                      </span>
                    )}
                  </div>
                  {room.last_message && (
                    <p className="mt-1 truncate text-xs text-gray-500">
                      {room.last_message.user.email}: {room.last_message.content}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden bg-gray-50">{children}</div>
    </div>
  )
}
