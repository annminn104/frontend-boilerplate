import { ChatRoom } from '@/features/chat/components/ChatRoom'

interface ChatRoomPageProps {
  params: {
    roomId: string
  }
}

export default function ChatRoomPage({ params }: ChatRoomPageProps) {
  return <ChatRoom roomId={params.roomId} />
}
