import { useState, useRef, useEffect } from 'react'
import { useWebSocket } from '../hooks/useWebSocket'
import { PresenceStatus } from '../lib/websocket'

interface ChatProps {
  roomId: string
  roomName?: string
}

export function Chat({ roomId, roomName }: ChatProps) {
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { isConnected, rooms, joinRoom, leaveRoom, sendMessage, updatePresence, markRoomAsRead } = useWebSocket({
    url: `ws://${window.location.host}/ws`,
    onError: error => console.error('WebSocket error:', error),
  })

  const room = rooms.find(r => r.id === roomId)

  // Join room on mount
  useEffect(() => {
    joinRoom(roomId, roomName)
    return () => leaveRoom(roomId)
  }, [roomId, roomName, joinRoom, leaveRoom])

  // Mark messages as read when room is visible
  useEffect(() => {
    if (room) {
      markRoomAsRead(roomId)
    }
  }, [room?.messages.length, roomId, markRoomAsRead])

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [room?.messages.length])

  // Handle message submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      sendMessage(roomId, message.trim())
      setMessage('')
    }
  }

  if (!isConnected) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Connecting...</p>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Room not found</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Room header */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold">{room.name}</h2>
        <div className="mt-1 flex space-x-2">
          {Array.from(room.participants.entries()).map(([userId, status]) => (
            <div key={userId} className="flex items-center space-x-1">
              <span
                className={`h-2 w-2 rounded-full ${
                  status === 'online' ? 'bg-green-500' : status === 'away' ? 'bg-yellow-500' : 'bg-red-500'
                }`}
              />
              <span className="text-sm text-gray-500">{userId}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {room.messages.map((message, index) => (
            <div
              key={message.id ?? index}
              className={`flex ${
                message.userId === room.participants.keys().next().value ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 ${
                  message.userId === room.participants.keys().next().value ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="mt-1 text-xs text-gray-500">{new Date(message.createdAt).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message input */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
          >
            Send
          </button>
        </div>
        <div className="mt-2 flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => updatePresence('online')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Online
          </button>
          <button
            type="button"
            onClick={() => updatePresence('away')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Away
          </button>
          <button
            type="button"
            onClick={() => updatePresence('busy')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Busy
          </button>
        </div>
      </form>
    </div>
  )
}
