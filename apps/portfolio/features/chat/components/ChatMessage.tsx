import { type Message } from '../types/chat'

interface ChatMessageProps {
  message: Message
  isOwnMessage: boolean
}

export function ChatMessage({ message, isOwnMessage }: ChatMessageProps) {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`rounded-lg px-4 py-2 ${isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'}`}>
        {!isOwnMessage && <div className="mb-1 text-xs text-gray-500">{message.user.email}</div>}
        <p>{message.content}</p>
        <div className={`mt-1 text-xs ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
          {new Date(message.createdAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
