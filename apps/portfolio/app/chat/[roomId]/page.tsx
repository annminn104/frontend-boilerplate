import { ChatRoom } from '@/features/chat/components/ChatRoom'

interface Props {
  params: Promise<{ roomId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ChatRoomPage({ params }: Props) {
  const { roomId } = await params
  return <ChatRoom roomId={roomId} />
}
